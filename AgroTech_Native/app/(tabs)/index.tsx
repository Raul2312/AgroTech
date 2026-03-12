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

type Product = {
name:string
price:number
image:string
rating:number
sale?:boolean
}

type CartItem = Product & { quantity:number }

export default function Marketplace(){

const [cart,setCart] = useState<CartItem[]>([])
const [search,setSearch] = useState("")
const [cartOpen,setCartOpen] = useState(false)

const products:Product[] = [

{
name:"Alimento Balanceado Premium",
price:480,
rating:4.8,
sale:true,
image:"https://images.unsplash.com/photo-1581579188871-45ea61f2a31c"
},

{
name:"Vacuna Bovimax",
price:1250,
rating:4.6,
image:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b"
},

{
name:"Bebedero Automático",
price:2300,
rating:4.7,
sale:true,
image:"https://images.unsplash.com/photo-1604186838309-c6715f0d3a16"
},

{
name:"Comedero Ganadero",
price:1800,
rating:4.5,
image:"https://images.unsplash.com/photo-1606788075761-9c0c4cbd7c66"
},

{
name:"Kit Veterinario Profesional",
price:3200,
rating:4.9,
sale:true,
image:"https://images.unsplash.com/photo-1581091215367-59ab6c6a1f0d"
},

{
name:"Bomba de Agua Agrícola",
price:4100,
rating:4.7,
image:"https://images.unsplash.com/photo-1592982537447-6c9d6a0e5e3b"
},

{
name:"Medicamento Ganadero",
price:950,
rating:4.4,
image:"https://images.unsplash.com/photo-1584367369853-9e1e1e96d6c1"
},

{
name:"Herramienta Agrícola",
price:760,
rating:4.3,
image:"https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
}

]

const addToCart = (product:Product)=>{

setCart(prev=>{

const exist = prev.find(p=>p.name===product.name)

if(exist){

return prev.map(p =>
p.name===product.name
? {...p,quantity:p.quantity+1}
:p
)

}

return [...prev,{...product,quantity:1}]

})

}

const changeQty=(index:number,change:number)=>{

const updated=[...cart]

updated[index].quantity+=change

if(updated[index].quantity<=0){
updated.splice(index,1)
}

setCart(updated)

}

const removeItem=(index:number)=>{

const updated=[...cart]
updated.splice(index,1)
setCart(updated)

}

const subtotal = cart.reduce((acc,item)=>acc+item.price*item.quantity,0)
const shipping = subtotal>2000 ? 0 : subtotal===0 ? 0 : 150
const total = subtotal + shipping

const cartCount = cart.reduce((acc,item)=>acc+item.quantity,0)

const filtered = products.filter(p =>
p.name.toLowerCase().includes(search.toLowerCase())
)

return(

<View style={styles.container}>

{/* HEADER */}

<View style={styles.header}>

<View style={styles.logoContainer}>

<Image
source={require("../../assets/images/agro.png")}
style={styles.logo}
/>

<Text style={styles.logoText}>AgroTech</Text>

</View>

<TouchableOpacity onPress={()=>setCartOpen(!cartOpen)}>
<Text style={styles.cartBtn}>🛒 {cartCount}</Text>
</TouchableOpacity>

</View>

{/* BUSCADOR */}

<View style={styles.searchContainer}>

<TextInput
placeholder="Buscar productos..."
style={styles.searchInput}
value={search}
onChangeText={setSearch}
/>

<TouchableOpacity style={styles.searchBtn}>
<Text style={styles.searchBtnText}>🔍</Text>
</TouchableOpacity>

</View>

<Text style={styles.section}>Categorías</Text>

<View style={styles.categories}>

<View style={styles.category}><Text>🌾 Alimentos</Text></View>
<View style={styles.category}><Text>💉 Veterinaria</Text></View>
<View style={styles.category}><Text>🚜 Equipos</Text></View>
<View style={styles.category}><Text>💧 Agua</Text></View>

</View>

<Text style={styles.section}>Productos</Text>

<FlatList
data={filtered}
numColumns={2}
keyExtractor={(item)=>item.name}
contentContainerStyle={{paddingBottom:120}}

renderItem={({item})=>(

<View style={styles.productCard}>

{item.sale && (
<View style={styles.saleTag}>
<Text style={styles.saleText}>OFERTA</Text>
</View>
)}

<Image
source={{uri:item.image}}
style={styles.productImg}
/>

<Text style={styles.productName}>{item.name}</Text>

<Text style={styles.rating}>⭐ {item.rating}</Text>

<Text style={styles.price}>${item.price} MXN</Text>

<TouchableOpacity
style={styles.addBtn}
onPress={()=>addToCart(item)}
>

<Text style={styles.addText}>Agregar</Text>

</TouchableOpacity>

</View>

)}
/>

{/* CARRITO */}

{cartOpen && (

<View style={styles.cartBox}>

<Text style={styles.cartTitle}>Carrito</Text>

<ScrollView style={{flex:1}}>

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
<Text style={styles.qtyBtn}>−</Text>
</TouchableOpacity>

<Text>{item.quantity}</Text>

<TouchableOpacity onPress={()=>changeQty(index,1)}>
<Text style={styles.qtyBtn}>+</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>removeItem(index)}>
<Text style={styles.delete}>🗑</Text>
</TouchableOpacity>

</View>

</View>

</View>

))}

</ScrollView>

<View style={styles.cartFooter}>

<Text>Subtotal: ${subtotal}</Text>
<Text>Envío: ${shipping}</Text>

<Text style={styles.total}>
Total: ${total}
</Text>

<TouchableOpacity style={styles.buyBtn}>
<Text style={styles.buyText}>Comprar</Text>
</TouchableOpacity>

</View>

</View>

)}

</View>

)

}

const styles = StyleSheet.create({

container:{flex:1,backgroundColor:"#f3f4f6"},

header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
paddingTop:55,
paddingHorizontal:20,
paddingBottom:15,
backgroundColor:"#166534"
},

logoContainer:{flexDirection:"row",alignItems:"center"},

logo:{width:35,height:35,marginRight:10},

logoText:{color:"white",fontSize:18,fontWeight:"bold"},

cartBtn:{color:"white",fontSize:18},

searchContainer:{flexDirection:"row",margin:20},

searchInput:{
flex:1,
backgroundColor:"white",
padding:10,
borderTopLeftRadius:10,
borderBottomLeftRadius:10
},

searchBtn:{
backgroundColor:"#16a34a",
paddingHorizontal:20,
justifyContent:"center",
borderTopRightRadius:10,
borderBottomRightRadius:10
},

searchBtnText:{color:"white",fontSize:18},

section:{fontSize:18,fontWeight:"bold",marginLeft:20,marginTop:10},

categories:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between",
paddingHorizontal:20,
marginTop:10
},

category:{
backgroundColor:"#e5e7eb",
padding:12,
borderRadius:10,
width:"45%",
alignItems:"center",
marginBottom:10
},

productCard:{
backgroundColor:"white",
margin:10,
padding:10,
borderRadius:10,
width:"45%",
elevation:3
},

productImg:{width:"100%",height:120,borderRadius:10},

productName:{fontWeight:"bold",marginTop:5},

rating:{color:"#f59e0b"},

price:{color:"#16a34a",marginVertical:5},

addBtn:{
backgroundColor:"#16a34a",
padding:8,
borderRadius:8
},

addText:{color:"white",textAlign:"center"},

saleTag:{
position:"absolute",
top:10,
left:10,
backgroundColor:"#ef4444",
paddingHorizontal:6,
borderRadius:5,
zIndex:5
},

saleText:{color:"white",fontSize:10},

cartBox:{
position:"absolute",
right:0,
top:90,
width:320,
height:"85%",
backgroundColor:"white",
borderTopLeftRadius:15,
borderBottomLeftRadius:15,
padding:15,
elevation:10
},

cartTitle:{fontSize:18,fontWeight:"bold",marginBottom:10},

cartItem:{flexDirection:"row",marginBottom:15},

cartImg:{width:50,height:50,borderRadius:6,marginRight:10},

qtyRow:{flexDirection:"row",alignItems:"center",marginTop:5},

qtyBtn:{fontSize:18,paddingHorizontal:10},

delete:{marginLeft:10,fontSize:18},

cartFooter:{borderTopWidth:1,borderColor:"#ddd",paddingTop:10},

total:{fontSize:18,fontWeight:"bold",marginTop:5},

buyBtn:{
backgroundColor:"#16a34a",
padding:12,
borderRadius:8,
marginTop:10
},

buyText:{color:"white",textAlign:"center",fontWeight:"bold"}

})