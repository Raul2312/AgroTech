import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../../context/CartContext";
import { useRouter, Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function carrito() {

const router = useRouter();
const { cart, increase, decrease, removeFromCart } = useCart();

const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const envio = subtotal > 0 ? 120 : 0;
const total = subtotal + envio;

return (

<>
<Stack.Screen options={{ headerShown: false }} />

<View style={styles.container}>

<LinearGradient
colors={["#0f172a","#14532d"]}
style={styles.header}
>

<TouchableOpacity onPress={() => router.back()}>
<Ionicons name="arrow-back" size={26} color="#fff" />
</TouchableOpacity>

<Text style={styles.headerTitle}>Carrito</Text>

<View style={{width:26}} />

</LinearGradient>

<FlatList
data={cart}
keyExtractor={(item) => item.id.toString()}
ListEmptyComponent={
<Text style={styles.empty}>Tu carrito está vacío</Text>
}
contentContainerStyle={{ paddingBottom: 220 }}
renderItem={({ item }) => (

<View style={styles.card}>

<Image source={{ uri: item.image }} style={styles.image} />

<View style={styles.info}>

<Text numberOfLines={2} style={styles.name}>
{item.name}
</Text>

<Text style={styles.price}>
${item.price} MXN
</Text>

<View style={styles.qtyRow}>

<TouchableOpacity
style={styles.qtyBtn}
onPress={() => decrease(item.id)}
>
<Ionicons name="remove" size={18} />
</TouchableOpacity>

<Text style={styles.qty}>{item.quantity}</Text>

<TouchableOpacity
style={styles.qtyBtn}
onPress={() => increase(item.id)}
>
<Ionicons name="add" size={18} />
</TouchableOpacity>

</View>

</View>

<TouchableOpacity
style={styles.deleteBtn}
onPress={() => removeFromCart(item.id)}
>
<MaterialIcons name="delete-outline" size={26} color="#ef4444" />
</TouchableOpacity>

</View>

)}
/>

<View style={styles.footer}>

<View style={styles.summary}>

<View style={styles.row}>
<Text style={styles.label}>Subtotal</Text>
<Text style={styles.value}>${subtotal}</Text>
</View>

<View style={styles.row}>
<Text style={styles.label}>Envío</Text>
<Text style={styles.value}>${envio}</Text>
</View>

<View style={styles.divider} />

<View style={styles.row}>
<Text style={styles.totalLabel}>Total</Text>
<Text style={styles.total}>${total} MXN</Text>
</View>

</View>

<TouchableOpacity style={styles.checkoutBtn}>

<Ionicons name="card-outline" size={22} color="#fff" style={{marginRight:8}} />

<Text style={styles.checkoutText}>Proceder al pago</Text>

</TouchableOpacity>

</View>

</View>

</>
);
}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f1f5f9"
},

header:{
flexDirection:"row",
alignItems:"center",
justifyContent:"space-between",
paddingTop:45,
paddingHorizontal:20,
paddingBottom:14
},

headerTitle:{
color:"#fff",
fontSize:20,
fontWeight:"bold"
},

card:{
flexDirection:"row",
backgroundColor:"#fff",
marginHorizontal:15,
marginTop:14,
padding:12,
borderRadius:14,
alignItems:"center",

shadowColor:"#000",
shadowOpacity:0.08,
shadowOffset:{width:0,height:3},
shadowRadius:4,
elevation:3
},

image:{
width:70,
height:70,
borderRadius:10,
marginRight:12
},

info:{
flex:1
},

name:{
fontWeight:"600",
fontSize:15,
marginBottom:4,
color:"#1e293b"
},

price:{
color:"#16a34a",
fontWeight:"bold",
marginBottom:8
},

qtyRow:{
flexDirection:"row",
alignItems:"center"
},

qtyBtn:{
backgroundColor:"#e2e8f0",
width:32,
height:32,
borderRadius:8,
alignItems:"center",
justifyContent:"center"
},

qty:{
marginHorizontal:12,
fontWeight:"bold",
fontSize:16
},

deleteBtn:{
padding:6
},

footer:{
position:"absolute",
bottom:0,
left:0,
right:0,
backgroundColor:"#fff",
padding:20,
borderTopLeftRadius:20,
borderTopRightRadius:20,

shadowColor:"#000",
shadowOpacity:0.08,
shadowOffset:{width:0,height:-3},
shadowRadius:6,
elevation:10
},

summary:{
marginBottom:15
},

row:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:8
},

label:{
color:"#64748b"
},

value:{
fontWeight:"600"
},

divider:{
height:1,
backgroundColor:"#e2e8f0",
marginVertical:8
},

totalLabel:{
fontSize:16,
fontWeight:"bold"
},

total:{
fontSize:22,
fontWeight:"bold",
color:"#16a34a"
},

checkoutBtn:{
backgroundColor:"#16a34a",
padding:16,
borderRadius:12,
flexDirection:"row",
alignItems:"center",
justifyContent:"center"
},

checkoutText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
},

empty:{
textAlign:"center",
marginTop:80,
fontSize:18,
color:"#64748b"
}

});