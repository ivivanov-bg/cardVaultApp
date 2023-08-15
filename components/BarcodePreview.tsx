import {
    View,
    FlatList,
    Text,
    Button,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useCallback } from 'react';
import barcodes from 'jsbarcode/src/barcodes';
import { SafeAreaView } from 'react-native-safe-area-context';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import QRCode from 'react-native-qrcode-svg';


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    barcode: {
        paddingTop: 50,
    },
    
    barcodeText: {
        paddingTop: 12,
        paddingBottom: 50,
        fontSize: 16,
        fontWeight: '500',
    },
})


export const PreviewItem = ({ 
    barcode, 
    format, 
    onSelect = (c) => {}, 
    style = styles.container
}) => {
                 
    const Encoder = barcodes[format];
    
    const valid = format !== 'QR' ?
        new Encoder(barcode, {}).valid()
      : true;
    
    return (
        <>
          { valid && <>
            <TouchableWithoutFeedback 
                onPress={() => onSelect(format) } >
<>
                
                { format !== 'QR' &&
                <Barcode value={barcode} 
                         format={format} 
                         text={barcode} 
                         height= {150} 
                         width={3}
                         maxWidth={350}
                         style={styles.barcode}
                         textStyle={styles.barcodeText}
                        />
                }
                
                { format === 'QR' && 
                <View style={style}>
                    <QRCode style={styles.barcode}
                            size={200}
                            value={barcode} />
                    <Text style={styles.barcodeText}>
                        {barcode}
                    </Text>
                </View> }
</>
            </TouchableWithoutFeedback>
          </>}
        </>
    );
}

const BarcodePreview = ({navigation, route, barcode, onSelect}) => {
    
    const types = [
        'CODE39',
        'CODE128',
        'CODE128A',
        'EAN13',
        'EAN8',
        'EAN5',
        'EAN2',
        'UPC',
        'UPCE',
        'ITF14',
        'ITF',
        'MSI',
        'MSI10',
        'MSI11',
        'MSI1010',
        'MSI1110',
        'pharmacode',
        'codabar',
        'QR']
    
    return(
        <SafeAreaView>
            <FlatList
              data={types}
              renderItem={ ({item}) => {
                return (
                    <PreviewItem barcode={barcode} 
                                 format={item}
                                 onSelect={onSelect}
                    />
                )}
              }
            />
            <Button title="Cancel" 
                    onPress={() => {
                        onSelect(null)
                    }} 
            />
        </SafeAreaView>
    );
}

export default BarcodePreview

