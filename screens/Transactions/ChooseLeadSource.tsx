import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getDealOptions } from './api';
import { TransactionTypeDataProps } from './interfaces';
import LeadSourceRow from './LeadSourceRow';

const backArrow = require('../../images/white_arrow_left.png');

export default function ChooseLeadSource(props: any) {
  const { title, setModalSourceVisible, setSelectedSource, lightOrDark } = props;
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [dealOptions, setDealOptions] = useState<TransactionTypeDataProps>();
  const [search, setSearch] = useState('');

  const handleRowPress = (index: number) => {
    console.log('row pressed choose: ' + index);
    setSelectedSource(dealOptions?.leadSources[index]);
    setModalSourceVisible(false);
  };

  function cancelPressed() {
    setModalSourceVisible(false);
  }

  useEffect(() => {
    fetchDealOptions(true);
  }, [isFocused]);

  function fetchDealOptions(isMounted: boolean) {
    setIsLoading(true);
    getDealOptions()
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          console.log(res.data);
          setDealOptions(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Image source={backArrow} style={styles.backArrow} />
        </TouchableOpacity>

        <Text style={styles.nameLabel}>{title}</Text>

        <TouchableOpacity>
          <Text style={styles.saveButton}>{''}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          {dealOptions?.leadSources.map((item, index) => (
            <LeadSourceRow key={index} data={item} lightOrDark={lightOrDark} onPress={() => handleRowPress(index)} />
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
  mainContent: {
    flex: 1,
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  backArrow: {
    width: 18,
    height: 18,
    marginRight: -10,
    marginTop: 1,
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
    marginLeft: 30,
  },
  saveButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginRight: '10%',
  },
});
