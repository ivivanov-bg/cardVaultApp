import {
    View,
    FlatList,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import React, { useState, useCallback } from 'react';
import barcodes from 'jsbarcode/src/barcodes';
import { SafeAreaView } from 'react-native-safe-area-context';
import Barcode from '@kichiyaki/react-native-barcode-generator';

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
})


const PreviewItem = ({ barcode, format, onSelect }) => {
                 
    const Encoder = barcodes[format];
    const valid = new Encoder(barcode, {}).valid();
    
    return (
        <View>
          { valid && <>
            <TouchableOpacity 
                onPress={() => onSelect(format) } >
                
                <Barcode value={barcode} 
                         format={format} 
                         text={barcode} 
                         height= {150} 
                         width={3}
                         maxWidth={350}
                         style={styles.barcode}
                         textStyle={styles.barcodeText}
                        />
            </TouchableOpacity>
          </>}
        </View>
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
        'codabar']
    
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

