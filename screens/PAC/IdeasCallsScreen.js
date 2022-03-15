import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
//import closeButton from '../../assets/button_close_white.png';
import closeButton from '../../assets/button_close_black.png';

export default function IdeasCallsScreen(props) {
  const { setModalCallsVisible } = props;
  const [section0Selected, setSection0Selected] = useState(false);
  const [section1Selected, setSection1Selected] = useState(false);
  const [section2Selected, setSection2Selected] = useState(false);
  const [section3Selected, setSection3Selected] = useState(false);
  const [section4Selected, setSection4Selected] = useState(false);
  const [section5Selected, setSection5Selected] = useState(false);

  function CancelPressed() {
    setModalCallsVisible(false);
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
    } else if (sectionIndex == 5) {
      setSection5Selected(!section5Selected);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={CancelPressed}>
          <Image source={closeButton} style={styles.closeX} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Call Ideas</Text>
        <TouchableOpacity>
          <Text style={styles.blankButton}></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity onPress={() => handleSectionTap(0)}>
          <Text style={styles.sectionTitleText}>Mayor Campaign Dialogue</Text>
        </TouchableOpacity>
        {section0Selected && <Text style={styles.sectionHeaderText}>General</Text>}
        {section0Selected && (
          <Text style={styles.contentText}>
            Oh, by the way, if you were buying or selling a home, or had a friend or family member who was, do you have
            an agent you would refer them to?
          </Text>
        )}
        {section0Selected && <Text style={styles.sectionHeaderText}>For People You Know Well</Text>}
        {section0Selected && (
          <Text style={styles.contentText}>
            Oh, by the way, if you were buying or selling a home, or had a friend or family member who was, am I the
            person you would refer them to?
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(1)}>
          <Text style={styles.sectionTitleText}>Big 3 Dialogue</Text>
        </TouchableOpacity>
        {section1Selected && <Text style={styles.sectionHeaderText}>Can I Be of Any Help?</Text>}
        {section1Selected && (
          <Text style={styles.contentText}>
            Hi, _______, this is ________ calling. How are you doing? How's the family [business, etc. (chit chat)]?
            _______, the reason I'm calling is because I want to know if you received the information I sent you this
            month on [raising your credit score]. I hope it was helpful to you...
          </Text>
        )}
        {section1Selected && <Text style={styles.sectionHeaderText}>Keep In Mind</Text>}
        {section1Selected && (
          <Text style={styles.contentText}>
            Also, keep in mind if you need a referral to a good trade or service professional, I come across some really
            good people from time to time...
          </Text>
        )}
        {section1Selected && <Text style={styles.sectionHeaderText}>The Value You Represent to Me</Text>}
        {section1Selected && (
          <Text style={styles.contentText}>
            ______, I just want to make sure you know how much I value our relationship. And, I want to build my
            business by working with great people like you.
          </Text>
        )}
        {section1Selected && <Text style={styles.sectionHeaderText}>Oh, By The Way®...</Text>}
        {section1Selected && (
          <Text style={styles.contentText}>
            Oh, by the way...________ if you know of someone who is looking to buy or sell a home, I'd love to help
            them. So when you come across these people, just give me a call with their name and business number and I'll
            be happy to follow up and take great care of them for you. Does that sound good to you?
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(2)}>
          <Text style={styles.sectionTitleText}>Easy Ways to Ask for a Referral</Text>
        </TouchableOpacity>
        {section2Selected && (
          <Text style={styles.contentText}>1. Oh, by the way®... I'm never too busy for your referrals</Text>
        )}
        {section2Selected && (
          <Text style={styles.contentText}>
            2. Oh, by the way®, if you know of someone who would appreciate the level of service I provide, please call
            me with their name and business number. I'll be happy to follow up and take great care of them.
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(3)}>
          <Text style={styles.sectionTitleText}>Check-in Call Dialogue for Buyers: Nothing New</Text>
        </TouchableOpacity>
        {section3Selected && <Text style={styles.sectionHeaderText}>Nothing new to report</Text>}
        {section3Selected && (
          <Text style={styles.contentText}>
            Hello ______, ______ here. I just wanted to check in with you for a quick update.
          </Text>
        )}
        {section3Selected && <Text style={styles.sectionHeaderText}>Need Header</Text>}
        {section3Selected && (
          <Text style={styles.contentText}>
            I've been monitoring activity on the market today and no new properties that meet our criteria have
            surfaced.
          </Text>
        )}
        {section3Selected && <Text style={styles.sectionHeaderText}>Need Header</Text>}
        {section3Selected && (
          <Text style={styles.contentText}>
            I'll be checking again first thing tomorrow morning and I'll call to give you a quick update then. Bye for
            now!
          </Text>
        )}
        {section3Selected && <Text style={styles.sectionHeaderText}>Oh, By The Way®...</Text>}

        <TouchableOpacity onPress={() => handleSectionTap(4)}>
          <Text style={styles.sectionTitleText}>Check-in Call Dialogue for Buyers: Something New</Text>
        </TouchableOpacity>
        {section4Selected && <Text style={styles.sectionHeaderText}>Something new to report</Text>}
        {section4Selected && (
          <Text style={styles.contentText}>
            Hello ______, ______ here. I just wanted to check in to give you a quick update.
          </Text>
        )}
        {section4Selected && <Text style={styles.sectionHeaderText}>Need Header</Text>}
        {section4Selected && (
          <Text style={styles.contentText}>
            I've been monitoring activity on the market today and I've found [two] new homes that meet our criteria. The
            addresses are ________ and ________. I'll email you the property information.
          </Text>
        )}
        {section4Selected && <Text style={styles.sectionHeaderText}>Need Header</Text>}
        {section4Selected && (
          <Text style={styles.contentText}>
            If you get a chance to drive by and check them out, let me know. Bye for now!
          </Text>
        )}

        <TouchableOpacity onPress={() => handleSectionTap(5)}>
          <Text style={styles.sectionTitleText}>Check-in Call Dialogue for Sellers</Text>
        </TouchableOpacity>
        {section5Selected && (
          <Text style={styles.contentText}>
            Hi _______, _______ here. I'm just checking in to give you an update. I want you to know _______, that
            getting your home sold is a high priority to me. I'm doing everything possible to get it sold. Here's the
            activity on your home this week
          </Text>
        )}
        {section5Selected && <Text style={styles.contentText}>(List activities you have engaged in)</Text>}
        {section5Selected && (
          <Text style={styles.contentText}>
            Do you have any questions or concerns for me _______? Just to remind you, I'm committed to being the
            megaphone to the marketplace for your home and we're doing everything we can to get you a good offer. Unless
            something comes up before then, I'll check in with you about this time next week.
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
