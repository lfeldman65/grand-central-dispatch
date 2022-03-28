import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import closeButton from '../../images/button_close_white.png';
const closeButton = require('../../images/button_close_black.png');

export default function IdeasNotesScreen(props) {
  const { setModalNotesVisible } = props;
  const [section0Selected, setSection0Selected] = useState(false);
  const [section1Selected, setSection1Selected] = useState(false);
  const [section2Selected, setSection2Selected] = useState(false);
  const [section3Selected, setSection3Selected] = useState(false);

  function CancelPressed() {
    setModalNotesVisible(false);
  }

  function handleSectionTap(sectionIndex) {
    if (sectionIndex == 0) {
      setSection0Selected(!section0Selected);
    } else if (sectionIndex == 1) {
      setSection1Selected(!section1Selected);
    } else if (sectionIndex == 2) {
      setSection2Selected(!section2Selected);
    } else if (sectionIndex == 3) {
      setSection3Selected(!section3Selected);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Personal Note Ideas</Text>
        <TouchableOpacity>
          <Text style={styles.blankButton}></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity onPress={() => handleSectionTap(0)}>
          <Text style={styles.sectionTitleText}>Ideas to Get You Started: Following a Phone Call</Text>
        </TouchableOpacity>
        {section0Selected && <Text style={styles.sectionHeaderText}>Following a Phone Call</Text>}
        {section0Selected && (
          <Text style={styles.contentText}>
            It was wonderful talking with you today. I appreciate you keeping me in mind if you know of anyone who is
            interested in looking into the opportunities we have for buyers in this market...
          </Text>
        )}
        {section0Selected && <Text style={styles.sectionHeaderText}>Leaving a Message</Text>}
        {section0Selected && <Text style={styles.contentText}>I tried calling you today, but missed you...</Text>}

        <TouchableOpacity onPress={() => handleSectionTap(1)}>
          <Text style={styles.sectionTitleText}>Ideas to Get You Started: Reconnecting</Text>
        </TouchableOpacity>
        {section1Selected && <Text style={styles.sectionHeaderText}>Option 1</Text>}
        {section1Selected && (
          <Text style={styles.contentText}>
            I found myself thinking of you today, so I thought I would write a quick note...
          </Text>
        )}
        {section1Selected && <Text style={styles.sectionHeaderText}>Option 2</Text>}
        {section1Selected && (
          <Text style={styles.contentText}>
            I was going through my files and realized it's been way too long since...
          </Text>
        )}
        {section1Selected && <Text style={styles.sectionHeaderText}>Option 3</Text>}
        {section1Selected && <Text style={styles.contentText}>How is your new home working out?</Text>}

        <TouchableOpacity onPress={() => handleSectionTap(2)}>
          <Text style={styles.sectionTitleText}>Ideas to Get You Started: Nice to Meet You</Text>
        </TouchableOpacity>
        {section2Selected && <Text style={styles.sectionHeaderText}>Nice to Meet You</Text>}
        {section2Selected && (
          <Text style={styles.contentText}>
            A brief note to let you know it was a real pleasure to meet you today...
          </Text>
        )}
        {section2Selected && <Text style={styles.sectionHeaderText}>Thank You Npte</Text>}
        {section2Selected && <Text style={styles.contentText}>Thank you for the great service today!</Text>}
        {section2Selected && <Text style={styles.sectionHeaderText}>Thanks for a Referral</Text>}
        {section2Selected && (
          <Text style={styles.contentText}>
            Thank you for your referral to [Bob and Linda]! I'll take excellent care of them. Your trust and support are
            greatly appreciated...
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(3)}>
          <Text style={styles.sectionTitleText}>Ideas to Get You Started: Thanks for a Referral</Text>
        </TouchableOpacity>
        {section3Selected && (
          <Text style={styles.contentText}>
            Thank you for your referral to [Bob and Linda]! I'll take excellent care of them. Your trust and support are
            greatly appreciated...
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    backgroundColor: 'white',
    width: '95%',
    height: '95%',
    alignSelf: 'center',
  },
  mainContent: {
    alignSelf: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  closeX: {
    marginTop: 4,
    width: 15,
    height: 15,
    marginLeft: '10%',
  },
  pageTitle: {
    color: 'black',
    fontSize: 20,
  },
  blankButton: {
    // Helps placement of X and title
    marginRight: '15%',
  },
  sectionTitleText: {
    color: '#02ABF7',
    fontSize: 14,
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  sectionHeaderText: {
    color: 'black',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
    marginRight: 20,
    fontWeight: '500',
  },
  contentText: {
    color: 'black',
    fontSize: 14,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
});
