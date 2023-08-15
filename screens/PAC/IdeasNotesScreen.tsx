import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { styles } from './stylesIdeas';

const closeDark = require('../../images/button_close_white.png');
const closeLight = require('../../images/button_close_black.png');

export default function IdeasNotesScreen(props: any) {
  const { lightOrDark, setModalNotesVisible } = props;
  const [section0Selected, setSection0Selected] = useState(false);
  const [section1Selected, setSection1Selected] = useState(false);
  const [section2Selected, setSection2Selected] = useState(false);
  const [section3Selected, setSection3Selected] = useState(false);
  const isFocused = useIsFocused();

  function CancelPressed() {
    setModalNotesVisible(false);
  }

  function handleSectionTap(sectionIndex: number) {
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
    <ScrollView style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={lightOrDark == 'dark' ? closeDark : closeLight} style={styles.closeX} />
        </TouchableOpacity>
        <Text style={lightOrDark == 'dark' ? styles.pageTitleDark : styles.pageTitleLight}>Personal Note Ideas</Text>
        <TouchableOpacity>
          <Text style={styles.blankButton}></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity onPress={() => handleSectionTap(0)}>
          <Text style={styles.sectionTitleText}>Ideas to Get You Started: Following a Phone Call</Text>
        </TouchableOpacity>
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Following a Phone Call
          </Text>
        )}
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            It was wonderful talking with you today. I appreciate you keeping me in mind if you know of anyone who is
            interested in looking into the opportunities we have for buyers in this market...
          </Text>
        )}
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Leaving a Message
          </Text>
        )}
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            I tried calling you today, but missed you...
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(1)}>
          <Text style={styles.sectionTitleText}>Ideas to Get You Started: Reconnecting</Text>
        </TouchableOpacity>
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>Option 1</Text>
        )}
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            I found myself thinking of you today, so I thought I would write a quick note...
          </Text>
        )}
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>Option 2</Text>
        )}
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            I was going through my files and realized it's been way too long since...
          </Text>
        )}
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>Option 3</Text>
        )}
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            How is your new home working out?
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(2)}>
          <Text style={styles.sectionTitleText}>Ideas to Get You Started: Nice to Meet You</Text>
        </TouchableOpacity>
        {section2Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Nice to Meet You
          </Text>
        )}
        {section2Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            A brief note to let you know it was a real pleasure to meet you today...
          </Text>
        )}
        {section2Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Thank You Note
          </Text>
        )}
        {section2Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            Thank you for the great service today!
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(3)}>
          <Text style={styles.sectionTitleText}>Ideas to Get You Started: Thanks for a Referral</Text>
        </TouchableOpacity>
        {section3Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            Thank you for your referral to [Bob and Linda]! I'll take excellent care of them. Your trust and support are
            greatly appreciated...
          </Text>
        )}
      </View>
      <Text style={styles.footer}></Text>
    </ScrollView>
  );
}
