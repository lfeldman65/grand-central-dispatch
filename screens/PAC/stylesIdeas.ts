import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  containerDark: {
    marginTop: '10%',
    backgroundColor: 'black',
    flex: 1,
  },
  containerLight: {
    marginTop: '10%',
    backgroundColor: 'white',
    flex: 1,
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
  pageTitleDark: {
    color: 'white',
    fontSize: 20,
  },
  pageTitleLight: {
    color: 'black',
    fontSize: 20,
  },
  blankButton: {
    // Helps placement of X and title
    marginRight: '15%',
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
  sectionHeaderDark: {
    color: 'white',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
    marginRight: 20,
    fontWeight: '500',
  },
  sectionHeaderLight: {
    color: 'black',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
    marginRight: 20,
    fontWeight: '500',
  },
  contentTextDark: {
    color: 'white',
    fontSize: 14,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  contentTextLight: {
    color: 'black',
    fontSize: 14,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 20,
  },
  footer: {
    height: 250,
  },
});
