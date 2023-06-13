import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getRolodexData } from './api';
import { RolodexDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import AtoZRow from './AtoZRow';
import AddNewRef from './AddNewReferral';

const magGlass = require('../../images/whiteSearch.png');
const blankButton = require('../../images/blankSearch.png'); // Preserves horizontal alignment of title bar

type TabType = 'Search Existing' | 'Add New';

export default function SelectReferralScreen(props: any) {
  const { setModalRelVisible, title, setSelectedRel, lightOrDark } = props;
  const [tabSelected, setTabSelected] = useState<TabType>('Search Existing');
  const isFocused = useIsFocused();
  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRowPress = (index: number) => {
    setSelectedRel(dataRolodex[index]);
    setModalRelVisible(false);
  };

  useEffect(() => {
    if (tabSelected == 'Search Existing') {
      fetchRolodexPressed('alpha');
    }
  }, [isFocused]);

  function existingPressed() {
    //  analytics.event(new Event('PAC', 'Calls Tab'));
    setTabSelected('Search Existing');
    fetchRolodexPressed('alpha');
  }

  function addNewPressed() {
    //  analytics.event(new Event('PAC', 'Notes Tab'));
    setTabSelected('Add New');
  }

  function cancelPressed() {
    setModalRelVisible(false);
  }

  function searchPressed() {
    console.log('search pressed');
  }

  function fetchRolodexPressed(type: string, isMounted: boolean = true) {
    setIsLoading(true);
    getRolodexData(type, '500')
      .then((res) => {
        if (!isMounted) {
          return;
        }
        if (res.status == 'error') {
          console.error(res.error);
        } else {
          setDataRolodex(res.data);
        }
        setIsLoading(false);
      })
      .catch((error) => console.error('failure ' + error));
  }

  useEffect(() => {
    let isMounted = true;
    fetchRolodexPressed('alpha', isMounted);
    return () => {
      isMounted = false;
    };
  }, [isFocused]);

  return (
    <View style={styles2.container}>
      <View style={styles2.topRow}>
        <TouchableOpacity onPress={cancelPressed}>
          <Text style={globalStyles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles2.nameLabel}>{title}</Text>
        <TouchableOpacity onPress={searchPressed}>
          <Image source={blankButton} style={styles2.blankButton} />
        </TouchableOpacity>
      </View>

      <View style={globalStyles.tabButtonRow}>
        <Text
          style={tabSelected == 'Search Existing' ? globalStyles.selected : globalStyles.unselected}
          onPress={existingPressed}
        >
          Search Existing
        </Text>
        <Text
          style={tabSelected == 'Add New' ? globalStyles.selected : globalStyles.unselected}
          onPress={addNewPressed}
        >
          Add New
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            {tabSelected == 'Search Existing' && (
              <View>
                {dataRolodex.map((item, index) => (
                  <AtoZRow
                    relFromAbove={'Rel'}
                    key={index}
                    data={item}
                    lightOrDark={lightOrDark}
                    onPress={() => handleRowPress(index)}
                  />
                ))}
              </View>
            )}
            {tabSelected == 'Add New' && (
              <View>
                <AddNewRef setSelectedRel={setSelectedRel} setModalVisible={setModalRelVisible}></AddNewRef>
              </View>
            )}
          </ScrollView>
        </React.Fragment>
      )}
    </View>
  );
}

const styles2 = StyleSheet.create({
  container: {
    backgroundColor: '#004F89',
    flex: 1,
    height: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 10,
  },
  closeButtonView: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  backArrow: {
    width: 17,
    height: 14,
    marginLeft: 7,
    marginTop: 2,
  },
  blankButton: {
    width: 80,
  },
  nameLabel: {
    color: 'white',
    fontSize: 18,
  },
});
