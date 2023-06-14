import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getRolodexData } from './api';
import { RolodexDataProps } from './interfaces';
import globalStyles from '../../globalStyles';
import AtoZRow from './AtoZRow';
import AddNewRef from './AddNewReferral';

const searchGlass = require('../../images/whiteSearch.png');
const blankButton = require('../../images/blankSearch.png'); // Preserves horizontal alignment of title bar
const closeButton = require('../../images/button_close_white.png');

type TabType = 'Relationships' | 'Add New';

export default function SelectReferralScreen(props: any) {
  const { setModalRelVisible, title, setSelectedRel, lightOrDark } = props;
  const [tabSelected, setTabSelected] = useState<TabType>('Relationships');
  const isFocused = useIsFocused();
  const [dataRolodex, setDataRolodex] = useState<RolodexDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const handleRowPress = (index: number) => {
    setSelectedRel(dataRolodex[index]);
    setModalRelVisible(false);
  };

  useEffect(() => {
    if (tabSelected == 'Relationships') {
      fetchRolodexPressed('alpha');
    }
  }, [isFocused]);

  function existingPressed() {
    //  analytics.event(new Event('PAC', 'Calls Tab'));
    setTabSelected('Relationships');
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

  function clearSearchPressed() {
    setSearch('');
  }

  function matchesSearch(person: RolodexDataProps, search?: string) {
    if (search == null || search == '') {
      return true;
    }
    var searchLower = search.toLowerCase();
    if (searchLower == '') {
      return true;
    }
    if (person.firstName != null && person.firstName.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (person.lastName != null && person.lastName.toLowerCase().includes(searchLower)) {
      return true;
    }
    if (
      person.address != null &&
      person.address.street != null &&
      person.address.street.toLowerCase().includes(searchLower)
    ) {
      return true;
    }
    if (
      person.address != null &&
      person.address.street2 != null &&
      person.address.street2.toLowerCase().includes(searchLower)
    ) {
      return true;
    }
    if (
      person.address != null &&
      person.address.city != null &&
      person.address.city.toLowerCase().includes(searchLower)
    ) {
      return true;
    }
    if (
      person.address != null &&
      person.address.state != null &&
      person.address.state.toLowerCase().includes(searchLower)
    ) {
      return true;
    }
    if (
      person.address != null &&
      person.address.zip != null &&
      person.address.zip.toLowerCase().includes(searchLower)
    ) {
      return true;
    }
    if (person.firstName != null && person.lastName != null) {
      var firstLast = person.firstName.toLowerCase() + ' ' + person.lastName.toLowerCase();
      if (firstLast.toLowerCase().includes(searchLower)) {
        return true;
      }
    }
    return false;
  }

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
          style={tabSelected == 'Relationships' ? globalStyles.selected : globalStyles.unselected}
          onPress={existingPressed}
        >
          Relationships
        </Text>
        <Text
          style={tabSelected == 'Add New' ? globalStyles.selected : globalStyles.unselected}
          onPress={addNewPressed}
        >
          Add New
        </Text>
      </View>

      {tabSelected == 'Relationships' && (
        <View style={globalStyles.searchView}>
          <Image source={searchGlass} style={globalStyles.magGlass} />
          <TextInput
            style={globalStyles.searchTextInput}
            placeholder="Search By Name or Address"
            placeholderTextColor="white"
            textAlign="left"
            defaultValue={search}
            onChangeText={(text) => setSearch(text)}
          />
          <TouchableOpacity onPress={clearSearchPressed}>
            <Image source={closeButton} style={globalStyles.closeX} />
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#AAA" />
        </View>
      ) : (
        <React.Fragment>
          <ScrollView>
            {tabSelected == 'Relationships' && (
              <View>
                {dataRolodex.map(
                  (item, index) =>
                    matchesSearch(item, search) && (
                      <AtoZRow
                        relFromAbove={'Rel'}
                        key={index}
                        data={item}
                        lightOrDark={lightOrDark}
                        onPress={() => handleRowPress(index)}
                      />
                    )
                )}
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
