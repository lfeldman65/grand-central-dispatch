import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
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
  otherText: {
    color: 'black',
    fontSize: 15,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 7,
  },
  bottomContainer: {
    backgroundColor: '#1A6295',
    height: '8%',
    justifyContent: 'center',
  },
  addRelButton: {
    marginTop: 5,
    backgroundColor: '#1A6295',
    paddingTop: 10,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    width: '95%',
    alignSelf: 'center',
  },
  addRelText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
  },
  rowDark: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    height: 80,
  },
  rowLight: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    height: 80,
  },
  rankingCircle: {
    height: 30,
    width: 30,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 5,
  },
  groupRowDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    backgroundColor: 'black',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 30,
  },
  groupRowLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 30,
  },
  chevron: {
    marginTop: 5,
    height: 20,
    width: 12,
  },
  listItemContainer: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderTopColor: '#e6ebf2',
    borderTopWidth: 1,
  },
  listItemLabel: {
    color: '#1c1b1e',
    fontSize: 14,
  },
  sectionHeaderContainer: {
    height: 30,
    backgroundColor: '#8e8e93',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  sectionHeaderLabel: {
    color: 'white',
  },
  centerSection: {
    height: '80%',
  },
  bottom: {
    height: '20%',
    backgroundColor: 'red',
  },
  itemDark: {
    flexDirection: 'row',
    backgroundColor: 'black',
    height: 80,
    padding: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  itemLight: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 80,
    padding: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  header: {
    fontSize: 24,
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
  },
  sectionTitle: { height: 30 },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
  rolodexAZ: {
    height: '63%',
  },
  rolodexRanking: {
    height: '74%',
  },
  rolodexGroups: {
    height: '69%',
  },
});
