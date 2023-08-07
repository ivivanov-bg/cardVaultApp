import { StyleSheet } from 'react-native';


export const MainStyle = StyleSheet.create({
  statusBar: {
    barStyle: 'light-content',
    backgroundColor: '#aaaaaa',
  },

  topBar: {
    borderBottomWidth: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 12,
    marginTop: 12,
    borderColor: '#F0F0F0',
  },

  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 12,
    borderColor: '#F0F0F0',
    gap: 8,
  },

});

