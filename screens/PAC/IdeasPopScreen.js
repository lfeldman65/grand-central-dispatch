import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import closeButton from '../../images/button_close_white.png';
import closeButton from '../../images/button_close_black.png';

export default function IdeasPopScreen(props) {
  const { setModalPopVisible } = props;
  const [section0Selected, setSection0Selected] = useState(false);
  const [section1Selected, setSection1Selected] = useState(false);
  const [section2Selected, setSection2Selected] = useState(false);
  const [section3Selected, setSection3Selected] = useState(false);
  const [section4Selected, setSection4Selected] = useState(false);

  function CancelPressed() {
    setModalPopVisible(false);
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
    } else if (sectionIndex == 4) {
      setSection4Selected(!section4Selected);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Pop-By Ideas</Text>
        <TouchableOpacity>
          <Text style={styles.blankButton}></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity onPress={() => handleSectionTap(0)}>
          <Text style={styles.sectionTitleText}>Pop-By Dialogue</Text>
        </TouchableOpacity>
        {section0Selected && <Text style={styles.sectionHeaderText}>Set-Up Dialogue</Text>}
        {section0Selected && (
          <Text style={styles.contentText}>
            "I'm going to be in your area tomorrow between [2:00 and 3:00]; I'd love to Pop-By and see how you're
            doing."
          </Text>
        )}
        {section0Selected && <Text style={styles.sectionHeaderText}>During Pop-By</Text>}
        {section0Selected && <Text style={styles.contentText}>Use Big 3 Dialogue.</Text>}
        {section0Selected && <Text style={styles.sectionHeaderText}>Leaving Dialogue</Text>}
        {section0Selected && (
          <Text style={styles.contentText}>"Oh, by the way®... I'm never too busy for any of your referrals."</Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(1)}>
          <Text style={styles.sectionTitleText}>Pop-By Gift Ideas: Winter</Text>
        </TouchableOpacity>
        {section1Selected && <Text style={styles.sectionHeaderText}>Can opener</Text>}
        {section1Selected && (
          <Text style={styles.contentText}>
            I can open the world of real estate for you, your friends and your family.
          </Text>
        )}
        {section1Selected && <Text style={styles.sectionHeaderText}>Box of chocolates</Text>}
        {section1Selected && (
          <Text style={styles.contentText}>
            Also, keep in mind if you need a referral to a good trade or service professional, I come across some really
            good people from time to time...
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(2)}>
          <Text style={styles.sectionTitleText}>Pop-By Gift Ideas: Spring</Text>
          {section2Selected && <Text style={styles.sectionHeaderText}>Reusable shopping bag</Text>}
        </TouchableOpacity>
        {section2Selected && (
          <Text style={styles.contentText}>Helping the environment and all of your referrals...</Text>
        )}
        {section2Selected && <Text style={styles.sectionHeaderText}>Peeps candy</Text>}
        {section2Selected && <Text style={styles.contentText}>Have your peeps call my peeps.</Text>}

        <TouchableOpacity onPress={() => handleSectionTap(3)}>
          <Text style={styles.sectionTitleText}>Pop-By Gift Ideas: Summer</Text>
        </TouchableOpacity>
        {section3Selected && <Text style={styles.sectionHeaderText}>Ice cream scoop</Text>}
        {section3Selected && (
          <Text style={styles.contentText}>
            Want the scoop on what the market is really like? Give me a call and I'd be happy to help!
          </Text>
        )}
        {section3Selected && <Text style={styles.sectionHeaderText}>Condiment pack (ketchup, mustard, relish)</Text>}
        {section3Selected && (
          <Text style={styles.contentText}>
            I just wanted to ketch-up and let you know that I relish your referrals! My clients are the best and always
            cut the mustard!
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(4)}>
          <Text style={styles.sectionTitleText}>Pop-By Gift Ideas: Fall</Text>
        </TouchableOpacity>
        {section4Selected && <Text style={styles.sectionHeaderText}>Ice pack</Text>}
        {section4Selected && <Text style={styles.contentText}>I won't leave your referrals cold! </Text>}
        {section4Selected && <Text style={styles.sectionHeaderText}>Dog biscuits or bones</Text>}
        {section4Selected && (
          <Text style={styles.contentText}>No bones about it, I have your real estate needs covered.</Text>
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
    marginRight: '10%',
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
