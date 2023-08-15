import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { CardList, Card, AddCard } from './components/Cards'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MenuProvider } from 'react-native-popup-menu';
import MainStore from './components/MainStore'
import { useEffect, useState } from 'react'
import { cards as staticData } from './data/Data'


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

  const save = (card: CardData, callback = null) => {
      MainStore.save({
      key: 'cards',
      id: card.barcode,
      data: {
        title: card.title, 
        code: card.barcode, 
        format: card.format,
      }
    }).then( () => {
        if (callback !== null) { 
            load(callback) 
        }
    })
      .catch(error => console.error(error));
  }

  const load = (callback) => {
      MainStore.getAllDataForKey('cards')
               .then( data => callback(data))
               .catch( error => {
                   console.error(error)
                   MainStore.clearMapForKey('cards')
                })
  }

  const remove = (card: CardData, callback) => {
     MainStore.remove({
      key: 'cards',
      id: card.code,
    }).then(() => load(callback))
  }

  return (
    <MenuProvider>
        <NavigationContainer>
          <StatusBar />
          <Stack.Navigator
            // screenOptions={{ headerShown: false }} 
          > 
            <Stack.Screen name="Home">
            { props => 
              <HomeScreen {...props} onLoad={load} onDelete={remove} />
            }
            </Stack.Screen>
            <Stack.Screen name="Card" component={Card} />
            <Stack.Screen name="AddCard">
            { props => 
              <AddCard {...props} onSave={save} />
            }
            </Stack.Screen>
            <Stack.Screen name="EditCard" component={AddCard} />
          </Stack.Navigator>
        </NavigationContainer>
    </MenuProvider>
  );
}


const TopBar = ({navigation}) => {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarInner}>
        <Text style={styles.topBarItem}>Top Bar</Text>
        <Text style={styles.topBarItem}
              onPress={() => 
                navigation.navigate('AddCard', {})
              } 
        >
          ADD CARD
        </Text>
      </View>
    </View>
  );
}

const HomeScreen = (props) => {

  const [cards, setCards] = useState([])
  


  useEffect(() => {
    props.onLoad(setCards)
  }, [])

  useEffect(() => {
     //  staticData.forEach(async (c) => await MainStore.save({
     //      key: 'cards',
     //      id: c.code,
     //      data: {
     //        title: c.title, 
     //        code: c.code, 
     //        format: c.format
     //      }
     //    }))

    const unsubscribe = props.navigation.addListener('focus', async () => props.onLoad(setCards));

    return unsubscribe;
  }, [props.navigation]);
  

  return (
    <View>
      <TopBar {...props} />
      <CardList {...props} data={cards} onDelete={(c) => {
          props.onDelete(c, setCards)
      }} />
    </View>
  );
}


