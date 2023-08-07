import { 
    Alert, 
    FlatList, 
    View, 
    Text, 
    TextInput,
    Button,
    TouchableHighlight,
    StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import * as Brightness from 'expo-brightness';
import Barcode from '@kichiyaki/react-native-barcode-generator'

const styles = StyleSheet.create({
    listContainer: {
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingRight: 12,
      paddingLeft: 12,
      borderColor: '#F0F0F0',
    },
    
    listItem: {
      height: 40,
      borderBottomWidth: 1,
      borderColor: '#F0F0F0',
      justifyContent: 'center',
    },
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingLeft: 8,
        paddingRight: 8,
        alignItems: 'stretch',
        alignContent: 'center',
    },
    
    barcode: {
        paddingTop: 50,
        paddingBottom: 50,
    },
    
    barcodeText: {
        paddingTop: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    
    headerTitle: {
        fontSize: 64,
        fontWeight: '800',
        textAlign: 'center',
    },
    
    input: {
      height: 40,
      margin: 4,
      borderColor: '#F0F0F0',
      borderBottomWidth: 1,
      padding: 10,
    },
    
});

export type CardData = {
  title: string;
  code: string;
};


export const CardList = ({navigation, data}) => {
  return (
    <View style={styles.listContainer} >
       <FlatList
          data={data}
          renderItem={ ({item}) => 
            <CardListItem navigation={navigation} 
                          card={item} /> 
          }
       />
    </View>
  );
}

export const CardListItem = ({navigation, card}) => {
 
  return (
    <TouchableHighlight style={styles.listItem} 
      onPress={() => { 
        navigation.navigate('SingleCard', {card: card})
      }} >
      <Text> {card.title} </Text>
    </TouchableHighlight>
  );
}

export const Card = ({navigation, route}) => {
  const card = route.params.card
  
  useEffect(() => {
    var b = 0.1;
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        b = await Brightness.getSystemBrightnessAsync()
        Brightness.setSystemBrightnessAsync(0.6);
      }
    })();
    
    return () => {
      Brightness.setSystemBrightnessAsync(b);
    }
  }, []);
  
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerTitle} 
              adjustsFontSizeToFit={true}
              numberOfLines={1}
        > 
          {card.title} 
        </Text>
      </View>
      <Barcode value={card.code} 
               format={card.format} 
               text={card.code} 
               height= {150} 
               width={3}
               maxWidth={350}
               style={styles.barcode}
               textStyle={styles.barcodeText}
      />
    </View>
  );
}

export const AddCard = ({navigation, route}) => {
  
  const [title, setTitle] = useState("");
  const [barcode, setBarcode] = useState("");
  
  return (
     <View style={{...styles.container,
                      justifyContent: 'center'}}>
       <Text style={{textAlign: 'center',}}>ADD NEW CARD</Text>
       <TextInput 
         style={styles.input}
         placeholder="Card name"
         onChangeText={setTitle}
         value={title}
       />
       <TextInput 
         style={styles.input}
         placeholder="Barcode"
         onChangeText={setBarcode}
         value={barcode}
       />
       <Button title="Save" disabled={!title.length || !barcode.length}
          onPress={() => {
           
          }} 
       
       />
     </View>
  );
}



