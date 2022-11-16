import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { storage } from '../../utils/storage';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { styles } from './stylesIdeas';

const closeDark = require('../../images/button_close_white.png');
const closeLight = require('../../images/button_close_black.png');

export default function IdeasPopScreen(props: any) {
  const { lightOrDark, setModalPopVisible } = props;
  const [section0Selected, setSection0Selected] = useState(false);
  const [section1Selected, setSection1Selected] = useState(false);
  const [section2Selected, setSection2Selected] = useState(false);
  const [section3Selected, setSection3Selected] = useState(false);
  const [section4Selected, setSection4Selected] = useState(false);
  const isFocused = useIsFocused();

  function CancelPressed() {
    setModalPopVisible(false);
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
    } else if (sectionIndex == 4) {
      setSection4Selected(!section4Selected);
    }
  }

  return (
    <ScrollView style={lightOrDark == 'dark' ? styles.containerDark : styles.containerLight}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={lightOrDark == 'dark' ? closeDark : closeLight} style={styles.closeX} />
        </TouchableOpacity>
        <Text style={lightOrDark == 'dark' ? styles.pageTitleDark : styles.pageTitleLight}>Pop-By Ideas</Text>
        <TouchableOpacity>
          <Text style={styles.blankButton}></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity onPress={() => handleSectionTap(0)}>
          <Text style={styles.sectionTitleText}>Pop-By Dialogue</Text>
        </TouchableOpacity>
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Set-Up Dialogue
          </Text>
        )}
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            "I'm going to be in your area tomorrow between [2:00 and 3:00]; I'd love to Pop-By and see how you're
            doing."
          </Text>
        )}
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            During Pop-By
          </Text>
        )}
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            Use Big 3 Dialogue.
          </Text>
        )}
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Leaving Dialogue
          </Text>
        )}
        {section0Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            "Oh, by the way®... I'm never too busy for any of your referrals."
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(1)}>
          <Text style={styles.sectionTitleText}>Pop-By Gift Ideas: Winter</Text>
        </TouchableOpacity>
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>Can Opener</Text>
        )}
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            I can open the world of real estate for you, your friends and your family.
          </Text>
        )}
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Box of Chocolates
          </Text>
        )}
        {section1Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            Also, keep in mind if you need a referral to a good trade or service professional, I come across some really
            good people from time to time...
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(2)}>
          <Text style={styles.sectionTitleText}>Pop-By Gift Ideas: Spring</Text>
          {section2Selected && (
            <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
              Reusable Shopping Bag
            </Text>
          )}
        </TouchableOpacity>
        {section2Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            Helping the environment and all of your referrals...
          </Text>
        )}
        {section2Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>Peeps Candy</Text>
        )}
        {section2Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            Have your peeps call my peeps.
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(3)}>
          <Text style={styles.sectionTitleText}>Pop-By Gift Ideas: Summer</Text>
        </TouchableOpacity>
        {section3Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Ice Cream Scoop
          </Text>
        )}
        {section3Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            Want the scoop on what the market is really like? Give me a call and I'd be happy to help!
          </Text>
        )}
        {section3Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Condiment Pack (Ketchup, Mustard, Relish)
          </Text>
        )}
        {section3Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            I just wanted to ketch-up and let you know that I relish your referrals! My clients are the best and always
            cut the mustard!
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(4)}>
          <Text style={styles.sectionTitleText}>Pop-By Gift Ideas: Fall</Text>
        </TouchableOpacity>
        {section4Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>Ice Pack</Text>
        )}
        {section4Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            I won't leave your referrals cold!{' '}
          </Text>
        )}
        {section4Selected && (
          <Text style={lightOrDark == 'dark' ? styles.sectionHeaderDark : styles.sectionHeaderLight}>
            Dog Biscuits or Bones
          </Text>
        )}
        {section4Selected && (
          <Text style={lightOrDark == 'dark' ? styles.contentTextDark : styles.contentTextLight}>
            No bones about it, I have your real estate needs covered.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
