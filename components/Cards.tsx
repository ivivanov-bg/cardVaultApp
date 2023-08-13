import { 
    Alert, 
    FlatList, 
    View, 
    Text, 
    TextInput,
    Button,
    TouchableHighlight,
    StyleSheet, 
    Modal
} from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { useState, useEffect } from 'react'
import * as Brightness from 'expo-brightness';
import MainStore from './MainStore';
import Barcode from '@kichiyaki/react-native-barcode-generator'
import BarcodePreview from './BarcodePreview';

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
  format: string;
};


export const CardList = (
    {navigation, data, onDelete}
  :{data: Array<CardData>}
) => {
  
  return (
    <View style={styles.listContainer} >
       <FlatList
          data={data}
          renderItem={ ({item}) => 
            <CardListItem navigation={navigation} 
                          card={item} 
                          onDelete={onDelete}/> 
          }
       />
    </View>
  );
}

export const CardListItem = ({
    navigation, 
    card, 
    onDelete,
} : { card: CardData }

) => {
    
  var menu;;
 
  return (
    <TouchableHighlight  
      onLongPress={()=>menu.open()}
      
      onPress={() => { 
        navigation.navigate('Card', {card: card})
      }} >
      <View style={styles.listItem} >
        <Text> {card.title} </Text>
        <Menu ref={c => (menu = c)} >
            <MenuTrigger text='' />
            <MenuOptions>
              <MenuOption text={card.title} disabled={true}/>
              <MenuOption onSelect={() => alert(`Save`)} 
                          text='Save' />
              <MenuOption onSelect={() => onDelete(card)} >
                <Text style={{color: 'red'}}>Delete</Text>
              </MenuOption>
            </MenuOptions>
        </Menu>
      </View>
    </TouchableHighlight>
  );
}

export const Card = ({navigation, route}) => {
  const card = route.params.card
  
  useEffect(() => {
    var b = 0.1;
    var bMode: Brightness.BrightnessMode = Brightness.BrightnessMode.UNKNOWN;
    (async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {

        bMode = await Brightness.getSystemBrightnessModeAsync()

        b = await Brightness.getSystemBrightnessAsync()
        Brightness.setSystemBrightnessAsync(0.8);
      }
    })();
    
    return () => {
      if (bMode == Brightness.BrightnessMode.MANUAL) {
        Brightness.setSystemBrightnessAsync(b);
      } else {
        Brightness.setSystemBrightnessModeAsync(Brightness.BrightnessMode.AUTOMATIC);
      }
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

  const [preview, showPreview] = useState(false);

  const save = async (card: CardData) => {
    MainStore.save({
      key: 'cards',
      id: card.barcode,
      data: {
        title: card.title, 
        code: card.barcode, 
        format: card.format,
      }
    }).then( () => navigation.goBack())
      .catch(error => console.log(error));

  }
  
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
            showPreview(true)
          }} 
      />

      <Modal visible={preview}>
        <BarcodePreview navigation={navigation} route={route} barcode={barcode} onSelect={(format: string) => {
          if (format !== null) {
            save({barcode: barcode, title: title, format: format})
          } else {
              showPreview(false)
          }
        }}/>
      </Modal>
    </View>
  );
}



