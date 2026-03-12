import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useCart } from "./context/CartContext";

export default function Carrito() {

const { cart, increase, decrease, removeFromCart } = useCart();

const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

return (

<View style={styles.container}>

<FlatList
data={cart}
keyExtractor={(item) => item.id.toString()}
ListEmptyComponent={<Text style={styles.empty}>Carrito vacío</Text>}
renderItem={({ item }) => (

<View style={styles.item}>

<Image source={{ uri: item.image }} style={styles.image} />

<View style={{ flex:1 }}>

<Text style={styles.name}>{item.name}</Text>

<Text style={styles.price}>${item.price}</Text>

<View style={styles.qtyRow}>

<TouchableOpacity onPress={() => decrease(item.id)}>
<Text style={styles.qtyBtn}>-</Text>
</TouchableOpacity>

<Text style={styles.qty}>{item.quantity}</Text>

<TouchableOpacity onPress={() => increase(item.id)}>
<Text style={styles.qtyBtn}>+</Text>
</TouchableOpacity>

</View>

</View>

<TouchableOpacity onPress={() => removeFromCart(item.id)}>
<Text style={styles.delete}>🗑</Text>
</TouchableOpacity>

</View>

)}
/>

<View style={styles.footer}>

<Text style={styles.total}>Total: ${total}</Text>

<TouchableOpacity style={styles.buyBtn}>
<Text style={styles.buyText}>Comprar</Text>
</TouchableOpacity>

</View>

</View>
);
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f1f5f9"
},

item:{
flexDirection:"row",
backgroundColor:"#fff",
margin:10,
padding:10,
borderRadius:10,
alignItems:"center"
},

image:{
width:70,
height:70,
marginRight:10
},

name:{
fontWeight:"bold"
},

price:{
color:"#16a34a"
},

qtyRow:{
flexDirection:"row",
alignItems:"center",
marginTop:5
},

qtyBtn:{
fontSize:20,
paddingHorizontal:10
},

qty:{
marginHorizontal:10
},

delete:{
fontSize:20
},

footer:{
padding:20,
borderTopWidth:1,
borderColor:"#e2e8f0"
},

total:{
fontSize:20,
fontWeight:"bold",
marginBottom:10
},

buyBtn:{
backgroundColor:"#16a34a",
padding:15,
borderRadius:10
},

buyText:{
color:"#fff",
textAlign:"center",
fontWeight:"bold"
},

empty:{
textAlign:"center",
marginTop:50,
fontSize:18
}

});