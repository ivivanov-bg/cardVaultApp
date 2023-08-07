import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { CardList, Card, AddCard } from './components/Card.tsx'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { cards } from './data/Data.ts'


const styles = StyleSheet.create({

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
  
  topBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  
  topBarItem: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
  },

});



const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <StatusBar />
      <Stack.Navigator
         screenOptions={{ headerShown: false }} 
      > 
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SingleCard" component={Card} />
        <Stack.Screen name="AddCard" component={AddCard} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}


const TopBar = ({navigation}) => {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarInner}>
        <Text style={styles.topBarItem}>Top Bar</Text>
        <Text style={styles.topBarItem}
              onPress={() => 
                navigation.navigate('AddCard')
              } 
        >
          ADD CARD
        </Text>
      </View>
    </View>
  );
}

const HomeScreen = (props) => {
  return (
    <View>
      <TopBar {...props} />
      <CardList {...props} data={cards} />
    </View>
  );
}







