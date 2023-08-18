import { FlatList, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { CardList, Card, AddCard , CardScreenProps, EditCardScreenProps } from './components/Cards'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MenuProvider } from 'react-native-popup-menu';
import MainStore from './components/MainStore'
import Scanner from './components/BarcodeScanner'
import { useEffect, useState } from 'react'
import { cards as staticData } from './data/Data'
import { CardData } from './model/Card.ts'


const styles = StyleSheet.create({

  topBar: {
    borderBottomWidth: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 12,
    borderColor: '#F0F0F0',
  },
  
  topBarInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  topBarItem: {
    flexGrow: 1,
//    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
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
      data: card
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
      id: card.barcode,
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
            <Stack.Screen name="EditCard">
            { (props: EditCardScreenProps) => 
              <AddCard {...props} onSave={save} />
            }
            </Stack.Screen>
            <Stack.Screen name="Scan" component={Scanner} />
          </Stack.Navigator>
        </NavigationContainer>
    </MenuProvider>
  );
}


const TopBar = ({navigation}) => {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarInner}>
        <View style={styles.topBarItem}>
            <Text>...</Text>
        </View>
        <TouchableOpacity style={styles.topBarItem}
              onPress={() => 
                navigation.navigate('EditCard', {})
              } >
            <Text>ADD CARD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const HomeScreen = (props) => {

  const [cards, setCards] = useState<Array<CardData>>([])
  


  useEffect(() => {
    props.onLoad(setCards)
  }, [])

  useEffect(() => {
     //  staticData.forEach(async (c) => await MainStore.save({
     //      key: 'cards',
     //      id: c.barcode,
     //      data: {
     //        title: c.title, 
     //        barcode: c.barcode, 
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


