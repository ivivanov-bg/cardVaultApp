import { 
    Alert, 
    FlatList, 
    View, 
    Text, 
    TextInput,
    Button,
    TouchableOpacity,
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
import BarcodePreview, { PreviewItem } from './BarcodePreview';

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
        justifyContent: 'top',
    },
    
    headerTitle: {
        fontSize: 64,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 50,
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
    {navigation, data, onDelete, onAdd}
  :{data: Array<CardData>, 
    onDelete: (c: CardData) => any,
    onAdd: (c: CardData) => any,
  }
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
    
  var menu;
  const show = (card) => {
      navigation.navigate('Card', {card: card})
  }
  
  const edit = (card) => {
      navigation.navigate('EditCard', {card: card})
  }
 
  return (
    <TouchableOpacity  
      onLongPress={()=>menu.open()}
      onPress={() => show(card)}
    >
      <View style={styles.listItem} >
        <Text> {card.title} </Text>
        <Menu ref={c => (menu = c)} >
            <MenuTrigger text='' />
            <MenuOptions customStyles={{
                optionWrapper: styles.listItem
            }}>
              <MenuOption text={card.title} disabled={true}/>
              <MenuOption onSelect={() => edit(card)} 
                          text='Edit' />
              <MenuOption onSelect={() => onDelete(card)} >
                <Text style={{color: 'red'}}>Delete</Text>
              </MenuOption>
            </MenuOptions>
        </Menu>
      </View>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle} 
              adjustsFontSizeToFit={true}
              numberOfLines={1}
        > 
          {card.title} 
        </Text>
        <PreviewItem barcode={card.code} 
                   format={card.format} />
    </View>
  );
}

export const AddCard = ({navigation, route, onSave}
:{
    onSave: (c: CardData) => any
}) => {
  
  const card = route.params.card ??= { title: '', code: ''}
  const [title, setTitle] = useState(card.title)
  const [barcode, setBarcode] = useState(card.code)

  const [preview, showPreview] = useState(false);

  return (
    <View style={{...styles.container,
                      justifyContent: 'center'}}>
      <Text style={{textAlign: 'center',}}>Card Details</Text>
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
            onSave({barcode: barcode, title: title, format: format})
            navigation.goBack()
          } else {
              showPreview(false)
          }
        }}/>
      </Modal>
    </View>
  );
}



