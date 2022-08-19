import { Text, View, Image, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { RolodexDataProps } from './interfaces';
import { useState, useEffect } from 'react';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const rankAPlus = require('../Relationships/images/rankAPlus.png');
const rankA = require('../Relationships/images/rankA.png');
const rankB = require('../Relationships/images/rankB.png');
const rankC = require('../Relationships/images/rankC.png');
const rankD = require('../Relationships/images/rankD.png');

interface AtoZRowProps {
  data: RolodexDataProps;
  onPress(): void;
  relFromAbove: string;
}

function chooseImage(rank: string) {
  if (rank == 'A+') return rankAPlus;
  if (rank == 'A') return rankA;
  if (rank == 'B') return rankB;
  if (rank == 'C') return rankC;
  return rankD;
}

export default function RankingRow(props: AtoZRowProps) {
  const { relFromAbove } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const [displayOrder, setDisplayOrder] = useState('First Last');
  const isFocused = useIsFocused();

  useEffect(() => {
    let isMounted = true;
    getDarkOrLightMode();
    getDisplayAZ(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

  function displayName(first: string, last: string, type: string, employer: string, isAZ: boolean) {
    if (type == 'Rel') {
      if (displayOrder == 'First Last') {
        return first + ' ' + last;
      }
      return last + ', ' + first;
    }
    return employer + ' (' + first + ')';
  }

  async function getDisplayAZ(isMounted: boolean) {
    if (!isMounted) {
      return;
    }
    const relOrder = await storage.getItem('displayAZ');
    if (relOrder == null || relOrder == 'First Last') {
      setDisplayOrder('First Last');
    } else {
      setDisplayOrder('Last, First');
    }
  }

  return (
    <TouchableOpacity onPress={props.onPress}>
      {props.data.contactTypeID == relFromAbove && (
        <View style={lightOrDark == 'dark' ? styles.rowDark : styles.rowLight}>
          <Image source={chooseImage(props.data.ranking)} style={styles.rankingCircle} />
          {relFromAbove == 'Rel' && (
            <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
              {displayName(
                props.data.firstName,
                props.data.lastName,
                props.data.contactTypeID,
                props.data.employerName,
                true
              )}
            </Text>
          )}
          {relFromAbove == 'Biz' && (
            <Text style={lightOrDark == 'dark' ? styles.personNameDark : styles.personNameLight}>
              {displayName(
                props.data.firstName,
                props.data.lastName,
                props.data.contactTypeID,
                props.data.employerName,
                true
              )}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
