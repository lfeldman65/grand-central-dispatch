import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useIsFocused, RouteProp } from '@react-navigation/native';
import { useEffect } from 'react';
import React from 'react';
import globalStyles from '../../globalStyles';
import { getRolodexData } from './api';
import { RolodexImportDataProps } from './interfaces';
import ImportRelRow from './ImportRelRow';
import * as Contacts from 'expo-contacts';
import { addNewContact } from './api';
import DarkOrLightScreen from '../../utils/DarkOrLightScreen';
import { determineDeviceType } from '../../utils/general';

// dataRM[] = rolodex in RM app
// dataNative[] = native contacts
// dataImport[] = data displayed on screen (potential imports)
//
// foreach(rmContact in dataRM){
//    foreach(nativeContact in dataNative){
//        if(rmContact.firstName != nativeContact.firstName && rmContact.lastName != nativeContact.lastName){
//            Add rmContact to dataImport
//        }
//    }
// }

export default function ImportRelScreen2(props: any) {
  const isFocused = useIsFocused();
  const [dataRM, setDataRM] = useState<RolodexImportDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightOrDark, setLightOrDark] = useState('');
  const navigation = useNavigation<any>();

  var numImport = 0;

  useEffect(() => {
    navigation.setOptions({
      title: 'Import Relationships',
      headerRight: () => (
        <TouchableOpacity style={styles.saveButton} onPress={savePressed}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, dataRM]);

  useEffect(() => {
    let isMounted = true;
    fetchNativeContacts(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function fetchNativeContacts(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    setIsLoading(true);

    //fetch from API to get contacts in our store
    getRolodexData('alpha')
      .then((res) => {
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          //  console.log(res.data);
          var contactsToDisplay: RolodexImportDataProps[] = [];

          Contacts.requestPermissionsAsync().then((status) => {
            if (status.status === Contacts.PermissionStatus.GRANTED) {
              if (determineDeviceType() == 'Android') {
                Contacts.getContactsAsync({
                  fields: [
                    Contacts.Fields.FirstName,
                    Contacts.Fields.PhoneNumbers,
                    Contacts.Fields.Emails,
                    Contacts.Fields.Note,
                  ],
                }).then((cs) => {
                  const { data } = cs;
                  data.forEach((nativeElement) => {
                    var add = true;
                    var firstName = nativeElement.firstName ?? '';
                    var lastName = nativeElement.lastName ?? '';
                    var homePhone: string | undefined = '';
                    var mobile: string | undefined = '';
                    var officePhone: string | undefined = '';
                    var email: string | undefined = '';
                    var notes: string | undefined = '';

                    nativeElement.phoneNumbers?.forEach((e) => {
                      if (e.label == 'mobile') {
                        mobile = e.number;
                      } else if (e.label == 'home' || e.label == 'main') {
                        homePhone = e.number;
                      } else if (e.label == 'work') {
                        officePhone = e.number;
                      }
                      notes = nativeElement.note;
                      nativeElement.emails?.forEach((e) => {
                        email = e.email;
                      });
                    });
                    res.data.forEach((cloudElement) => {
                      if (firstName == cloudElement.firstName && lastName == cloudElement.lastName) {
                        add = false;
                      }
                      if (firstName == '' && lastName == '') {
                        add = false;
                      }
                    });

                    if (add) {
                      var rp: RolodexImportDataProps = {
                        firstName: nativeElement.firstName ?? '',
                        lastName: nativeElement.lastName ?? '',
                        id: nativeElement.id,
                        ranking: '',
                        contactTypeID: '',
                        employerName: '',
                        qualified: false,
                        selected: false,
                        homePhone: homePhone,
                        mobile: mobile,
                        officePhone: officePhone,
                        email: email,
                        notes: notes,
                        didChange: false,
                      };
                      contactsToDisplay.push(rp);
                    }
                  });

                  contactsToDisplay.sort(function (a, b) {
                    return a.lastName.localeCompare(b.lastName);
                  });

                  setDataRM(contactsToDisplay);
                  setIsLoading(false);
                });
              } else {
                Contacts.getContactsAsync({
                  fields: [Contacts.Fields.FirstName, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
                }).then((cs) => {
                  const { data } = cs;
                  data.forEach((nativeElement) => {
                    var add = true;

                    var firstName = nativeElement.firstName ?? '';
                    var lastName = nativeElement.lastName ?? '';
                    var homePhone: string | undefined = '';
                    var mobile: string | undefined = '';
                    var officePhone: string | undefined = '';
                    var email: string | undefined = '';

                    nativeElement.phoneNumbers?.forEach((e) => {
                      if (e.label == 'mobile') {
                        mobile = e.number;
                      } else if (e.label == 'home' || e.label == 'main') {
                        homePhone = e.number;
                      } else if (e.label == 'work') {
                        officePhone = e.number;
                      }

                      nativeElement.emails?.forEach((e) => {
                        email = e.email;
                        //  console.log(e.email);
                      });
                    });
                    res.data.forEach((cloudElement) => {
                      if (firstName == cloudElement.firstName && lastName == cloudElement.lastName) {
                        add = false;
                      }
                      if (firstName == '' && lastName == '') {
                        add = false;
                      }
                    });

                    if (add) {
                      var rp: RolodexImportDataProps = {
                        firstName: nativeElement.firstName ?? '',
                        lastName: nativeElement.lastName ?? '',
                        id: nativeElement.id,
                        ranking: '',
                        contactTypeID: '',
                        employerName: '',
                        qualified: false,
                        selected: false,
                        homePhone: homePhone,
                        mobile: mobile,
                        officePhone: officePhone,
                        email: email,
                        notes: '',
                        didChange: false,
                      };
                      contactsToDisplay.push(rp);
                    }
                  });

                  contactsToDisplay.sort(function (a, b) {
                    return a.lastName.localeCompare(b.lastName);
                  });

                  setDataRM(contactsToDisplay);
                  setIsLoading(false);
                });
              }
            } else {
              setIsLoading(false);
            }
          });
        }
      })
      .catch((error) => console.error('failure ' + error));
  }

  function selectAllPressed() {
    console.log('select all pressed');
    var contactsToDisplay: RolodexImportDataProps[] = [];
    for (let i = 0; i < dataRM.length; i++) {
      dataRM[i].selected = true;
      contactsToDisplay.push(dataRM[i]);
    }

    setDataRM(contactsToDisplay);
  }

  function deselectAllPressed() {
    console.log('deselect all pressed');

    var contactsToDisplay: RolodexImportDataProps[] = [];
    for (let i = 0; i < dataRM.length; i++) {
      dataRM[i].selected = false;
      contactsToDisplay.push(dataRM[i]);
    }

    setDataRM(contactsToDisplay);
  }

  async function savePressed() {
    setIsLoading(true);

    for (let i = 0; i < dataRM.length; i++) {
      if (dataRM[i].selected == true) {
        //  console.log(dataRM[i].firstName + ' ' + dataRM[i].selected);
        await addNewContact(
          dataRM[i].firstName,
          dataRM[i].lastName,
          'Rel',
          '',
          '',
          '',
          dataRM[i].homePhone,
          dataRM[i].mobile,
          dataRM[i].officePhone,
          dataRM[i].email,
          dataRM[i].notes
        )
          .then((res) => {
            if (res.status == 'error') {
              console.log(res);
              console.error(res.error);
            } else {
              //  console.log(res);
              numImport++;
            }
          })
          .catch((error) => console.error('failure ' + error));
      }
    }
    displayNumImport();
    setIsLoading(false);
  }

  function displayNumImport() {
    if (numImport == 1) {
      Alert.alert(numImport.toString() + ' relationship was imported');
    } else if (numImport > 1) {
      Alert.alert(numImport.toString() + ' relationships were imported');
    }
    navigation.navigate('SettingsScreen');
  }

  const handleRowPress = (index: number) => {
    dataRM[index].selected = !dataRM[index].selected;

    var contactsToDisplay: RolodexImportDataProps[] = [];
    for (let i = 0; i < dataRM.length; i++) {
      contactsToDisplay.push(dataRM[i]);
    }

    setDataRM(contactsToDisplay);
  };

  return (
    <>
      <DarkOrLightScreen setLightOrDark={setLightOrDark}></DarkOrLightScreen>
      <View style={styles.container}>
        <View style={globalStyles.tabButtonRow}>
          <Text style={styles.selected} onPress={selectAllPressed}>
            Select All
          </Text>
          <Text style={styles.selected} onPress={deselectAllPressed}>
            Deselect All
          </Text>
        </View>
        {isLoading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#AAA" />
          </View>
        )}
        {!isLoading && (
          <ScrollView>
            <View>
              {dataRM.map((item, index) => (
                <ImportRelRow
                  relFromAbove={item.firstName}
                  key={index}
                  data={item}
                  onPress={() => handleRowPress(index)}
                  lightOrDark={lightOrDark}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A6295',
    height: '100%',
  },
  saveButton: {
    padding: 10,
    // backgroundColor: '#00AAAA'
  },
  saveText: {
    color: 'white',
    fontSize: 18,
  },
  mainContent: {
    alignItems: 'center',
  },
  selected: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    height: '100%',
    backgroundColor: '#04121b',
    flex: 1,
    paddingTop: 11,
    borderColor: 'lightblue',
    borderWidth: 1,
  },
  topView: {
    height: 150,
    flexDirection: 'column',
    borderWidth: 0.5,
    borderTopColor: 'white',
    borderBottomColor: '#1A6295',
  },
  imageBox: {
    width: 200,
    height: 30,
    marginTop: 20,
    marginRight: 30,
    alignSelf: 'center',
  },
  logoImage: {
    height: 30,
    width: 200,
    marginLeft: 15,
    marginRight: 5,
    alignItems: 'center',
  },
  fieldText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  textInput: {
    fontSize: 18,
    color: '#FFFFFF',
    width: 300,
  },
  nameTitle: {
    color: 'white',
    marginLeft: 20,
    fontWeight: '500',
    marginBottom: 5,
    textAlign: 'left',
  },
  inputView: {
    backgroundColor: '#002341',
    width: '90%',
    height: 50,
    marginBottom: 20,
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingLeft: 10,
    fontSize: 29,
  },
  filterView: {
    width: '100%',
    padding: 12,
  },
  listItemCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    marginVertical: 15,
    borderRadius: 5,
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
});
