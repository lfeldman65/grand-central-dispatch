import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  containerDark: {
    backgroundColor: 'black',
    height: '100%',
  },
  containerLight: {
    backgroundColor: 'white',
    height: '100%',
  },
  tabButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    alignItems: 'center',
  },
  unselected: {
    color: 'lightgray',
    textAlign: 'center',
    fontSize: 15,
    height: '100%',
    backgroundColor: '#09334a',
    flex: 1,
    paddingTop: 11,
  },
  selected: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    height: '100%',
    backgroundColor: '#04121b',
    flex: 1,
    paddingTop: 11,
    borderColor: 'lightblue',
    borderWidth: 2,
  },

  // filters for To-Do's, Rolodex, etc
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  blankButton: {
    // Helps placement of title and chevron
    marginLeft: '10%',
  },
  filterText: {
    flexDirection: 'row',
    fontSize: 18,
    color: '#1398f5',
    marginTop: 9,
  },
  chevronFilter: {
    marginRight: 20,
    marginTop: 15,
    height: 12,
    width: 20,
  },

  //
  addButton: {
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
  addText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    justifyContent: 'center',
  },
  bottomContainer: {
    backgroundColor: '#1A6295',
    height: 60,
  },

  // Drop-Down Menues
  listItemCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItem: {
    flex: 1,
    marginVertical: 30,
    borderRadius: 5,
    fontSize: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
});
