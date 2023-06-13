import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getGoalDataConcise } from './api';
import { GoalDataConciseProps } from './interfaces';
import GoalRow from './ChooseGoalRow';
import globalStyles from '../../globalStyles';

const blankButton = require('../../images/blankSearch.png');

export default function ChooseGoalScreen(props: any) {
  const { title, setModalGoalVisible, setSelectedGoal, showSelectOne, lightOrDark } = props;
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [goalList, setGoalList] = useState<GoalDataConciseProps[]>([]);

  const handleRowPress = (index: number) => {
    console.log(goalList[index].title);
    setSelectedGoal(goalList[index]);
    setModalGoalVisible(false);
  };

  function cancelPressed() {
    setModalGoalVisible(false);
  }

  useEffect(() => {
    let isMounted = true;
    fetchGoalList(isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  function fetchGoalList(isMounted: boolean) {
    console.log('fetch goals');
    setIsLoading(true);
    getGoalDataConcise()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          if (showSelectOne) {
            console.log('show: ' + showSelectOne);
            var initialGoal: GoalDataConciseProps = {
              id: 0,
              title: 'Select One (Optional)',
            };
            res.data.unshift(initialGoal);
            if (res.data.length >= 6) {
              // magic numbers are bad
              if (res.data[5].title.includes('Referrals')) {
                res.data.splice(5, 1);
              }
            }
          }
          setGoalList(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Text style={globalStyles.cancelButton}>{'Cancel'}</Text>
        </TouchableOpacity>
        <Text style={styles.nameLabel}>{title}</Text>
        <TouchableOpacity>
          <Image source={blankButton} style={styles.blankButton} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View>
          {goalList.map((item, index) => (
            <GoalRow key={index} data={item} lightOrDark={lightOrDark} onPress={() => handleRowPress(index)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004F89',
  },
  blankButton: {
    // Helps placement of arrow and title (there's probably a better way to do this)
    width: 100,
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
    marginLeft: 30,
  },
});
