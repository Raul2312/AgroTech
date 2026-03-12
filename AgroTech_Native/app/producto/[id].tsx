import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
View,
Text,
Image,
StyleSheet,
ScrollView,
TouchableOpacity
} from "react-native";

export default function Producto() {

const router = useRouter();
const { name, price, image, rating } = useLocalSearchParams();

const renderStars = () => {
const stars = [];
const rate = Number(rating) || 5;

for (let i = 0; i < rate; i++) {
stars.push(<Text key={i} style={styles.star}>⭐</Text>);
}

return stars;
};

return (

<>
<Stack.Screen
options={{
title: "Producto",
headerStyle: { backgroundColor: "#0f172a" },
headerTintColor: "#fff",
headerTitleAlign: "center",
}}
/>

<ScrollView style={styles.container}>

<Image source={{ uri: image as string }} style={styles.image} />

<View style={styles.card}>

<Text style={styles.title}>{name}</Text>

<View style={styles.ratingContainer}>
{renderStars()}
<Text style={styles.ratingText}>{rating}</Text>
</View>

<Text style={styles.price}>${price} MXN</Text>

<Text style={styles.description}>
Producto agrícola de alta calidad ideal para granjas, ranchos
y producción ganadera. Fabricado con materiales resistentes
para uso profesional en entornos rurales y agrícolas.
</Text>

<View style={styles.specs}>

<Text style={styles.specTitle}>Especificaciones</Text>

<View style={styles.specRow}>
<Text style={styles.specLabel}>Peso</Text>
<Text style={styles.specValue}>25 kg</Text>
</View>

<View style={styles.specRow}>
<Text style={styles.specLabel}>Tipo</Text>
<Text style={styles.specValue}>Alimento Ganadero</Text>
</View>

<View style={styles.specRow}>
<Text style={styles.specLabel}>Marca</Text>
<Text style={styles.specValue}>AgroTech</Text>
</View>

<View style={styles.specRow}>
<Text style={styles.specLabel}>Uso</Text>
<Text style={styles.specValue}>Producción Ganadera</Text>
</View>

</View>

<TouchableOpacity style={styles.cartButton}>
<Text style={styles.cartText}>🛒 Agregar al carrito</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.buyButton}>
<Text style={styles.buyText}>Comprar ahora</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.back}
onPress={() => router.back()}
>
<Text style={styles.backText}>← Volver</Text>
</TouchableOpacity>

</View>

</ScrollView>
</>
);
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f1f5f9"
},

image:{
width:"100%",
height:320,
resizeMode:"contain",
backgroundColor:"#fff"
},

card:{
backgroundColor:"#fff",
margin:15,
padding:20,
borderRadius:15,
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:10,
elevation:5
},

title:{
fontSize:24,
fontWeight:"bold",
marginBottom:10,
color:"#1e293b"
},

ratingContainer:{
flexDirection:"row",
alignItems:"center",
marginBottom:10
},

star:{
fontSize:18
},

ratingText:{
marginLeft:8,
color:"#64748b"
},

price:{
fontSize:30,
fontWeight:"bold",
color:"#16a34a",
marginBottom:20
},

description:{
fontSize:15,
color:"#475569",
lineHeight:22,
marginBottom:25
},

specs:{
borderTopWidth:1,
borderColor:"#e2e8f0",
paddingTop:15,
marginBottom:25
},

specTitle:{
fontSize:18,
fontWeight:"bold",
marginBottom:10,
color:"#1e293b"
},

specRow:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:8
},

specLabel:{
color:"#64748b"
},

specValue:{
fontWeight:"600",
color:"#334155"
},

cartButton:{
backgroundColor:"#16a34a",
padding:16,
borderRadius:10,
marginBottom:12
},

cartText:{
color:"#fff",
textAlign:"center",
fontSize:16,
fontWeight:"bold"
},

buyButton:{
backgroundColor:"#0ea5e9",
padding:16,
borderRadius:10
},

buyText:{
color:"#fff",
textAlign:"center",
fontSize:16,
fontWeight:"bold"
},

back:{
marginTop:20
},

backText:{
textAlign:"center",
color:"#64748b"
}

});