import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
View,
Text,
TextInput,
StyleSheet,
TouchableOpacity,
Image,
KeyboardAvoidingView,
Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function Login(){

const router = useRouter();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [showPassword,setShowPassword] = useState(false);

const handleLogin = () => {

if(email === "" || password === ""){
alert("Completa todos los campos");
return;
}

// Aquí después conectaremos con backend
router.replace("../index");

};

return(

<KeyboardAvoidingView
style={{flex:1}}
behavior={Platform.OS === "ios" ? "padding" : undefined}
>

<LinearGradient
colors={["#0f172a","#14532d","#16a34a"]}
style={styles.container}
>

<View style={styles.logoBox}>

<Image
source={require("../assets/images/agro.png")}
style={styles.logo}
/>

<Text style={styles.title}>
AgroTech
</Text>

<Text style={styles.subtitle}>
Marketplace Agropecuario
</Text>

</View>

<View style={styles.form}>

<View style={styles.inputBox}>

<Ionicons name="mail-outline" size={20} color="#16a34a"/>

<TextInput
placeholder="Correo electrónico"
placeholderTextColor="#94a3b8"
style={styles.input}
value={email}
onChangeText={setEmail}
/>

</View>

<View style={styles.inputBox}>

<Ionicons name="lock-closed-outline" size={20} color="#16a34a"/>

<TextInput
placeholder="Contraseña"
placeholderTextColor="#94a3b8"
secureTextEntry={!showPassword}
style={styles.input}
value={password}
onChangeText={setPassword}
/>

<TouchableOpacity
onPress={()=>setShowPassword(!showPassword)}
>
<Ionicons
name={showPassword ? "eye" : "eye-off"}
size={20}
color="#64748b"
/>
</TouchableOpacity>

</View>

<TouchableOpacity
style={styles.loginBtn}
onPress={handleLogin}
>

<Text style={styles.loginText}>
Iniciar Sesión
</Text>

</TouchableOpacity>

<TouchableOpacity
onPress={()=>router.push("./register")}
>

<Text style={styles.registerText}>
¿No tienes cuenta? Crear cuenta
</Text>

</TouchableOpacity>

</View>

</LinearGradient>

</KeyboardAvoidingView>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
padding:25
},

logoBox:{
alignItems:"center",
marginBottom:40
},

logo:{
width:90,
height:90,
marginBottom:10
},

title:{
color:"white",
fontSize:32,
fontWeight:"bold"
},

subtitle:{
color:"#d1fae5"
},

form:{
backgroundColor:"white",
borderRadius:20,
padding:25,
elevation:10
},

inputBox:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#f1f5f9",
borderRadius:12,
paddingHorizontal:15,
marginBottom:15
},

input:{
flex:1,
height:45,
marginLeft:10,
color:"#1e293b"
},

loginBtn:{
backgroundColor:"#16a34a",
padding:15,
borderRadius:12,
alignItems:"center",
marginTop:10
},

loginText:{
color:"white",
fontWeight:"bold",
fontSize:16
},

registerText:{
marginTop:20,
textAlign:"center",
color:"#16a34a",
fontWeight:"600"
}

});