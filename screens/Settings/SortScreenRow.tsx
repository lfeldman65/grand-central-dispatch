import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { RolodexImportDataProps } from './interfaces';
import { useIsFocused } from '@react-navigation/native';

const aPlusSel = require('../Relationships/images/aPlusSel.png');
const aPlusReg = require('../Relationships/images/aPlusReg.png');
const aSel = require('../Relationships/images/aSel.png');
const aReg = require('../Relationships/images/aReg.png');
const bSel = require('../Relationships/images/bSel.png');
const bReg = require('../Relationships/images/bReg.png');
const cSel = require('../Relationships/images/cSel.png');
const cReg = require('../Relationships/images/cReg.png');
const dSel = require('../Relationships/images/dSel.png');
const dReg = require('../Relationships/images/dReg.png');
const qualChecked = require('../Relationships/images/qualChecked.png');
const qualUnchecked = require('../Relationships/images/qualUnchecked.png');

interface SortRowProps {
  data: RolodexImportDataProps;
  onQualChange(): void;
  onRankChange(rank: string): void;
  search: string;
  relFromAbove: string;
  lightOrDark: string;
}

export default function SortScreenRow(props: SortRowProps) {
  const { search, relFromAbove, data, lightOrDark } = props;
  const isFocused = useIsFocused();

  function handleRankPress(rank: string) {
    console.log('rank1: ' + rank);
    props.onRankChange(rank);
  }

  function handleQualPress() {
    props.onQualChange();
  }

  function getRankButtonImage(rank: string) {
    if (rank == 'A+') {
      if (data.ranking == 'A+') {
        return aPlusSel;
      }
      return aPlusReg;
    }
    if (rank == 'A') {
      if (data.ranking == 'A') {
        return aSel;
      }
      return aReg;
    }
    if (rank == 'B') {
      if (data.ranking == 'B') {
        return bSel;
      }
      return bReg;
    }
    if (rank == 'C') {
      if (data.ranking == 'C') {
        return cSel;
      }
      return cReg;
    }
    if (rank == 'D') {
      if (data.ranking == 'D') {
        return dSel;
      }
      return dReg;
    }
  }

  function displayRow() {
    if (search == '') {
      return true;
    }
    if (relFromAbove == null) {
      return false;
    }
    if (relFromAbove.includes(search)) {
      return true;
    }
    return false;
  }

  return (
    <TouchableOpacity>
      {displayRow() && (
        <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>{relFromAbove}</Text>
          <View style={styles.rankTitleRow}>
            <Text style={styles.subTitle}>Ranking</Text>
            <Text style={styles.subTitle}>Qualified</Text>
          </View>
          <View style={styles.rankAndQualRow}>
            <View style={lightOrDark == 'dark' ? styles.rankSection : styles.rankSection}>
              <TouchableOpacity onPress={() => handleRankPress('A+')}>
                <Image source={getRankButtonImage('A+')} style={styles.rankButton} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleRankPress('A')}>
                <Image source={getRankButtonImage('A')} style={styles.rankButton} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleRankPress('B')}>
                <Image source={getRankButtonImage('B')} style={styles.rankButton} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleRankPress('C')}>
                <Image source={getRankButtonImage('C')} style={styles.rankButton} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleRankPress('D')}>
                <Image source={getRankButtonImage('D')} style={styles.rankButton} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => handleQualPress()}>
              <Image source={data.qualified ? qualChecked : qualUnchecked} style={styles.qualButton} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowDark: {
    flexDirection: 'column',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 5,
  },
  rowLight: {
    flexDirection: 'column',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 5,
  },
  personNameDark: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  personNameLight: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
    marginTop: 5,
    fontWeight: '500',
  },
  rankTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    marginBottom: 5,
    marginRight: 10,
    marginLeft: -5,
  },
  rankAndQualRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    paddingRight: 20,
  },
  rankSection: {
    flexDirection: 'row',
    height: 35,
  },
  rankingCircle: {
    height: 30,
    width: 30,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 5,
  },
  subTitle: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 15,
    marginBottom: 10,
  },
  rankButton: {
    width: 25,
    height: 25,
    marginTop: -10,
    marginLeft: 12,
  },
  qualButton: {
    width: 25,
    height: 25,
    marginTop: -10,
    marginLeft: 12,
  },
});
