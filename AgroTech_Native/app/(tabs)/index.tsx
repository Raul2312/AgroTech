import React, { useState } from "react";
import {
View,
Text,
Image,
StyleSheet,
FlatList,
TouchableOpacity,
TextInput,
ScrollView
} from "react-native";

type CartItem = {
name: string;
price: number;
image: string;
quantity: number;
};

export default function Marketplace() {

const [cart, setCart] = useState<CartItem[]>([]);
const [search, setSearch] = useState("");
const [cartOpen, setCartOpen] = useState(false);

const products = [
{
name:"Alimento Balanceado Premium",
price:480,
image:"https://images.unsplash.com/photo-1581579188871-45ea61f2a31c"
},
{
name:"Vacuna Bovimax",
price:1250,
image:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b"
},
{
name:"Bebedero Automático",
price:2300,
image:"https://images.unsplash.com/photo-1604186838309-c6715f0d3a16"
}
];

const addToCart = (product:any)=>{

setCart(prev=>{

const exist = prev.find(p=>p.name===product.name);

if(exist){
return prev.map(p =>
p.name===product.name
? {...p,quantity:p.quantity+1}
:p
);
}

return [...prev,{...product,quantity:1}];

});

};

const changeQty = (index:number,change:number)=>{

const updated=[...cart];
updated[index].quantity+=change;

if(updated[index].quantity<=0){
updated.splice(index,1);
}

setCart(updated);

};

const subtotal = cart.reduce((acc,item)=>acc + item.price*item.quantity,0);
const shipping = subtotal>2000 ? 0 : subtotal===0 ? 0 : 150;
const total = subtotal + shipping;

const cartCount = cart.reduce((acc,item)=>acc+item.quantity,0);

const filtered = products.filter(p =>
p.name.toLowerCase().includes(search.toLowerCase())
);

return(

<View style={styles.container}>

{/* HEADER */}

<View style={styles.header}>

<View style={styles.logoRow}>

<Image
source={require("../../assets/images/agro.png")}
style={styles.logoImg}
/>

<Text style={styles.logoText}>
AgroTech Marketplace
</Text>

</View>

<TouchableOpacity onPress={()=>setCartOpen(true)}>

<Text style={styles.cart}>
🛒 {cartCount}
</Text>

</TouchableOpacity>

</View>

<ScrollView>

{/* HERO */}

<View style={styles.hero}>

<Text style={styles.heroTitle}>
Productos Profesionales para Ganadería
</Text>

<TextInput
placeholder="Buscar alimento, vacunas..."
style={styles.search}
value={search}
onChangeText={setSearch}
/>

</View>

{/* CATEGORIAS */}

<Text style={styles.sectionTitle}>Categorías</Text>

<View style={styles.categories}>

<View style={styles.category}><Text>🌾 Alimentos</Text></View>
<View style={styles.category}><Text>💉 Veterinaria</Text></View>
<View style={styles.category}><Text>🚜 Equipamiento</Text></View>
<View style={styles.category}><Text>🧴 Higiene</Text></View>
<View style={styles.category}><Text>💧 Agua</Text></View>
<View style={styles.category}><Text>⚙ Herramientas</Text></View>

</View>

{/* PRODUCTOS */}

<Text style={styles.sectionTitle}>
Productos Destacados
</Text>

<FlatList
data={filtered}
numColumns={2}
scrollEnabled={false}
keyExtractor={(item)=>item.name}
renderItem={({item})=>(

<View style={styles.productCard}>

<Image
source={{uri:item.image}}
style={styles.productImg}
/>

<Text style={styles.productName}>
{item.name}
</Text>

<Text style={styles.price}>
${item.price} MXN
</Text>

<TouchableOpacity
style={styles.buyBtn}
onPress={()=>addToCart(item)}
>

<Text style={styles.buyText}>
Agregar
</Text>

</TouchableOpacity>

</View>

)}
/>

</ScrollView>

{/* CARRITO */}

{cartOpen && (

<View style={styles.cartBox}>

<View style={styles.cartHeader}>

<Text style={styles.cartTitle}>
Tu carrito
</Text>

<TouchableOpacity onPress={()=>setCartOpen(false)}>
<Text style={styles.closeBtn}>✕</Text>
</TouchableOpacity>

</View>

<ScrollView>

{cart.map((item,index)=>(

<View key={index} style={styles.cartItem}>

<Image
source={{uri:item.image}}
style={styles.cartImg}
/>

<View style={{flex:1}}>

<Text>{item.name}</Text>
<Text>${item.price}</Text>

<View style={styles.qtyRow}>

<TouchableOpacity onPress={()=>changeQty(index,-1)}>
<Text style={styles.qtyBtn}>-</Text>
</TouchableOpacity>

<Text>{item.quantity}</Text>

<TouchableOpacity onPress={()=>changeQty(index,1)}>
<Text style={styles.qtyBtn}>+</Text>
</TouchableOpacity>

</View>

</View>

</View>

))}

<Text style={styles.total}>Subtotal: ${subtotal}</Text>
<Text style={styles.total}>Envío: ${shipping}</Text>
<Text style={styles.total}>Total: ${total}</Text>

<TouchableOpacity style={styles.buyFinal}>
<Text style={styles.buyFinalText}>
Comprar
</Text>
</TouchableOpacity>

</ScrollView>

</View>

)}

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f2f6f4"
},

header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
paddingTop:50,
paddingHorizontal:20,
paddingBottom:15,
backgroundColor:"#14532d"
},

logoRow:{
flexDirection:"row",
alignItems:"center",
gap:10
},

logoImg:{
width:35,
height:35
},

logoText:{
color:"white",
fontSize:18,
fontWeight:"bold"
},

cart:{
color:"white",
fontSize:18
},

hero:{
padding:20
},

heroTitle:{
fontSize:20,
fontWeight:"bold",
marginBottom:10
},

search:{
backgroundColor:"white",
padding:10,
borderRadius:10
},

sectionTitle:{
fontSize:18,
fontWeight:"bold",
margin:20
},

categories:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between",
paddingHorizontal:10
},

category:{
backgroundColor:"#e2e8f0",
padding:12,
borderRadius:10,
width:"30%",
alignItems:"center",
marginBottom:10
},

productCard:{
backgroundColor:"white",
padding:10,
margin:10,
borderRadius:10,
width:"45%",
elevation:3
},

productImg:{
width:"100%",
height:120,
borderRadius:10
},

productName:{
fontWeight:"bold",
marginTop:5
},

price:{
color:"#16a34a",
marginBottom:5
},

buyBtn:{
backgroundColor:"#16a34a",
padding:8,
borderRadius:8
},

buyText:{
color:"white",
textAlign:"center"
},

cartBox:{
position:"absolute",
right:0,
top:90,
backgroundColor:"white",
width:280,
height:"80%",
padding:15,
borderTopLeftRadius:15,
borderBottomLeftRadius:15,
elevation:10
},

cartHeader:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:10
},

closeBtn:{
fontSize:20
},

cartTitle:{
fontWeight:"bold",
fontSize:16
},

cartItem:{
flexDirection:"row",
marginBottom:10
},

cartImg:{
width:50,
height:50,
marginRight:10,
borderRadius:5
},

qtyRow:{
flexDirection:"row",
alignItems:"center",
gap:10
},

qtyBtn:{
fontSize:18,
paddingHorizontal:8
},

total:{
marginTop:5,
fontWeight:"bold"
},

buyFinal:{
backgroundColor:"#16a34a",
padding:10,
borderRadius:8,
marginTop:10
},

buyFinalText:{
color:"white",
textAlign:"center",
fontWeight:"bold"
}

});