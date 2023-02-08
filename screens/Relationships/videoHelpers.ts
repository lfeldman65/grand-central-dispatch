import * as ImagePicker from 'expo-image-picker';
import * as SMS from 'expo-sms';
import { RelDetailsProps, FileUpload } from './interfaces';
import { ga4Analytics } from '../../utils/general';
import * as MediaLibrary from 'expo-media-library';

function prettyVideoType(hasBB: boolean) {
  if (hasBB) {
    return 'BombBomb';
  }
  return 'Standard';
}

export async function handleVideoFromAlbum(vidTitle: string, relationship: RelDetailsProps | undefined | null) {
  console.log('handle video from album with bb: ' + relationship?.hasBombBombPermission);
  ga4Analytics('Relationships_Video_Album', {
    contentType: prettyVideoType(relationship?.hasBombBombPermission!),
    itemId: 'id0511',
  });
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    videoQuality: 1,
    quality: 1,
  });

  console.log(result);

  if (!result.cancelled) {
    composeSMS(vidTitle, relationship, result);
  }
}

export async function handleVideoFromCamera(vidTitle: string, relationship: RelDetailsProps | undefined | null) {
  console.log('handle video from camera with bb: ' + relationship?.hasBombBombPermission);
  ga4Analytics('Relationships_Video_Camera', {
    contentType: prettyVideoType(relationship?.hasBombBombPermission!),
    itemId: 'id0512',
  });
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (permissionResult.granted === false) {
    return;
  }

  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    videoQuality: 1,
    quality: 1,
    aspect: [16, 9],

    //  videoMaxDuration: 10,
  });

  // Explore the result
  console.log(result);

  if (!result.cancelled) {
    saveImage(result.uri);
    composeSMS(vidTitle, relationship, result);
  }
}

const saveImage = async (uri: any) => {
  try {
    // Request device storage access permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      // Save image to media library
      await MediaLibrary.saveToLibraryAsync(uri);

      console.log('Image successfully saved');
    }
  } catch (error) {
    console.log(error);
  }
};

async function composeSMS(vidTitle: string, relationship: RelDetailsProps | undefined | null, result: any) {
  const isAvailable = await SMS.isAvailableAsync();
  if (relationship?.hasBombBombPermission) {
    var url = await uploadVideoTOBB(result.uri, vidTitle, relationship);
    console.log('sms this ' + url);
    if (isAvailable) {
      SMS.sendSMSAsync([relationship?.mobile ?? ''], 'Here is the video ' + url);
    }
  } else {
    if (isAvailable) {
      await SMS.sendSMSAsync([relationship?.mobile ?? ''], 'Here is the video', {
        attachments: {
          uri: result.uri,
          mimeType: 'video/mp4',
          filename: 'myvid.mp4',
        },
      });
    }
  }
}

async function uploadVideoTOBB(
  singleFile: string,
  videoTitle: string,
  relationship: RelDetailsProps | undefined | null
) {
  //Check if any file is selected or not
  if (singleFile != null) {
    //  console.log('upload to BB ' + relationship?.bombBombAPIKey + ' ' + relationship?.id);

    const fileToUpload: FileUpload = {
      uri: singleFile,
      name: 'upload.mp4',
      type: 'video/mp4',
    };

    const data = new FormData();
    data.append('apiKey', relationship?.bombBombAPIKey);
    data.append('videoTitle', videoTitle);
    data.append('videoFile', fileToUpload);

    let res = await fetch('https://buffinireferralmakerapi.azurewebsites.net/api/videoShare/uploadVideoFileAsync', {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data;',
        UserGuid: relationship?.userID ?? '',
        Accept: '*/*',
      },
    });

    let responseJson = await res.json();
    console.log(responseJson);
    //   urlString = "https://stagereferme.buffiniandcompany.com/video/" + urlString;
    var urlString = 'https://referme.buffiniandcompany.com/video/' + responseJson + '?C=' + relationship?.contactID;

    console.log(urlString);

    return urlString;
  }
}
