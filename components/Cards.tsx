import { 
    Alert, 
    FlatList, 
    View, 
    Text, 
    TextInput,
    Button,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet, 
    Modal,
    Image,
} from 'react-native'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react'
import * as Brightness from 'expo-brightness';
import MainStore from './MainStore';
import Barcode from '@kichiyaki/react-native-barcode-generator'
import { BarcodePreview, BarcodeList } from './BarcodePreview';
import { CardData } from '../model/Card.ts'
import { ScanScreenProps, Scanned } from './BarcodeScanner'

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
      justifyContent: 'flex-start',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      fontWeight: 500,
    },
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
        paddingLeft: 8,
        paddingRight: 8,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
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

type HomeScreenProps = NativeStackScreenProps<{
    Card: {card: CardData},
    EditCard: {card: CardData},
}>
type HomeScreenNavigation = HomeScreenProps['navigation']
type HomeScreenRoute = HomeScreenProps['route']

export type CardScreenProps = NativeStackScreenProps<{
    Card: {card: CardData},
}, 'Card'>

export type EditCardScreenProps = NativeStackScreenProps<{
    EditCard: {card: CardData},
    Scan: ScanScreenProps,
}, 'EditCard'>



export const CardList = (
    {navigation, data, onDelete, onAdd}
   :{
      navigation: HomeScreenNavigation
      data: Array<CardData>, 
      onDelete: (c: CardData) => void,
      onAdd: (c: CardData) => void,
  }
) => {
  
  return (
    <View style={styles.listContainer} >
       <FlatList
          data={data}
          renderItem={ ({item}) => 
            <CardListItem navigation={navigation} 
                          card = {item} 
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
} : {
    navigation: HomeScreenNavigation,
    card: CardData,
    onDelete: (c: CardData) => void,
}

) => {
    
  var menu;
  const show = (card: CardData) => {
      navigation.navigate('Card', {card: card})
  }
  
  const edit = (card: CardData) => {
      navigation.navigate('EditCard', {card: card})
  }
  
  
 
  const ImageMap = {
      'metro': require('../assets/logos/metro.jpg'),
      'billa': require('../assets/logos/billa.png'),
      'default': require('../assets/logos/none.png')
  }
  
  const img = ImageMap[card.logo] ?? ImageMap['default']
  
  
  return (
      
    <TouchableOpacity  
      onLongPress={()=>menu.open()}
      onPress={() => show(card)}
    >
      <View style={styles.listItem} >
        <Image 
            source={img} 
            resizeMode='stretch'
            style={{
                width: 48, height: 36, 
                paddingLeft: 5, paddingRight: 5,
            }}
        />
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

export const Card = ({navigation, route} :CardScreenProps) => {
  const card: CardData = route.params.card
  
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
        <BarcodePreview barcode={card.barcode} 
                   format={card.format} />
    </View>
  );
}

export const AddCard = ({navigation, route, onSave}
: EditCardScreenProps & {  
    onSave: (card: CardData) => any
}) => {
  
  const card = route.params.card ?? { title: '', barcode: '', format: null, logo: '' }
  const [title, setTitle] = useState(card.title)
  const [barcode, setBarcode] = useState(card.barcode)
  const [format, setFormat] = useState(card.format)
  const [logo, setLogo] = useState(card.logo)

  const [preview, showPreview] = useState(false);

  return (
    <View style={styles.container}>
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
      
      <TouchableOpacity onPress={() => {
            navigation.navigate('Scan', {onScanned: ({format, data}: Scanned) => {
 //               alert(`Bar code with type ${format} and data ${data} has been scanned!`)
                setBarcode(data)
                setFormat(format)
            }})
          }} style={{alignItems: 'center', 
                     paddingTop: 20, 
                     paddingBottom: 40,
          }}><>
          <Text>SCAN THE BARCODE</Text>
          <Image 
            source={require('../assets/scan.png')} 
            style={{width: 120, 
                    height: 100, 
                    }}
          
          />
          </>
      </TouchableOpacity>
      
      <TextInput 
         style={styles.input}
         placeholder="Logo"
         onChangeText={setLogo}
         value={logo}
      />

      <Button title="Save" disabled={!title.length || !barcode.length}
          onPress={() => {
            if (barcode !== card.barcode) {
                alert('Changed from ' + card.barcode + ' to ' + barcode)
            }
            if(format === null) {
              showPreview(true)
            } else {
              onSave({
                barcode: barcode, 
                title: title, 
                format: format,
                logo: logo,
              })
              navigation.goBack()
            }
          }} 
      />

      <Modal visible={preview}>
        <BarcodeList navigation={navigation} route={route} barcode={barcode} onSelect={(format: string) => {
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



