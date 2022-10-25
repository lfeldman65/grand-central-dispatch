import { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { storage } from '../../utils/storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getDealOptions } from './api';
import { TransactionTypeDataProps } from './interfaces';
import OtherTxTypeRow from './OtherTxTypeRow';

var prunedOptions = [];
const backArrow = require('../../images/white_arrow_left.png');

export default function ChooseOtherTxType(props: any) {
  const { title, setModalTypeVisible, setSelectedType } = props;
  const [lightOrDark, setIsLightOrDark] = useState('');
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true);
  const [dealOptions, setDealOptions] = useState<TransactionTypeDataProps>();
  const [search, setSearch] = useState('');

  const handleRowPress = (index: number) => {
    console.log('row pressed choose: ' + index);
    setSelectedType(dealOptions?.transactionType[index]);
    setModalTypeVisible(false);
  };

  function cancelPressed() {
    setModalTypeVisible(false);
  }

  useEffect(() => {
    fetchDealOptions(true);
  }, [isFocused]);

  useEffect(() => {
    var a = [];
  }, [dealOptions]);

  useEffect(() => {
    getDarkOrLightMode();
  }, [isFocused]);

  async function getDarkOrLightMode() {
    const dOrlight = await storage.getItem('darkOrLight');
    setIsLightOrDark(dOrlight ?? 'light');
  }

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

        <Text style={styles.nameLabel}>{'       ' + title}</Text>

        <TouchableOpacity>
          <Text style={styles.saveButton}>{'        '}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View>
          {dealOptions?.transactionType.map(
            (item, index) =>
              item != 'Buyer' &&
              item != 'Seller' &&
              item != 'Buyer & Seller' &&
              item != 'Purchase Loan' &&
              item != 'Refinance' && <OtherTxTypeRow key={index} data={item} onPress={() => handleRowPress(index)} />
          )}
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
  searchView: {
    backgroundColor: '#002341',
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'space-evenly',
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 7,
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 16,
    color: '#FFFFFF',
    width: 300,
  },
  topRow: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  closeX: {
    width: 15,
    height: 15,
    marginRight: -10,
    marginTop: 12,
  },
  backArrow: {
    width: 18,
    height: 18,
    marginRight: -10,
    marginTop: 1,
  },
  magGlass: {
    width: 20,
    height: 20,
    marginLeft: -20,
    marginTop: 8,
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
  notesText: {
    color: 'white',
    fontSize: 16,
    marginTop: 30,
    fontWeight: '500',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  inputViewDark: {
    marginTop: 10,
    backgroundColor: 'black',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  inputViewLight: {
    marginTop: 10,
    backgroundColor: 'white',
    width: '90%',
    height: '50%',
    marginBottom: 2,
    paddingLeft: 10,
    fontSize: 29,
    alignItems: 'flex-start',
  },
  textInputDark: {
    paddingTop: 5,
    fontSize: 18,
    color: 'white',
  },
  textInputLight: {
    paddingTop: 5,
    fontSize: 18,
    color: 'black',
  },
});
