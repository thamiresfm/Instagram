import React, { Component } from 'react';
import io from 'socket.io-client'
import api from '../services/api'

import { View, Text, Image, StyleSheet,TouchableOpacity, FlatList} from 'react-native';

import camera from '../assets/camera.png'
import more from '../assets/more.png'
import like from '../assets/like.png'
import comment from '../assets/comment.png'
import send from '../assets/send.png'




export default class Feed extends Component {
    static navigationOptions = ({navigation}) =>( {
        headerRight: (
        <TouchableOpacity style={{ marginRight:20 }} onPress={() => navigation.navigate('New')}>
            <Image source={camera}/>
        </TouchableOpacity>
        ),
        })
        state = {
            feed:[],

        }
        async componentDidMount(){
             this.registerToSocket()
            const response = await api.get('posts')

            console.log(response.data)
            this.setState({feed: response.data})
        }
        registerToSocket= () =>{
            const socket = io('http://localhost:3333')
            socket.on('post', newPost =>{
                this.setState({ feed: [newPost, ... this.state.feed]})
            })
    
            socket.on('Like', likePost =>{
                this.setState({ 
                    feed: this.state.feed.map(post =>
                        post._id ===likePost._id? likePost: post
                        )
                    
                
                })
            })
        }

  render() {
    return (
        <View style={styles.container}>
            <FlatList 
                data={this.state.feed}
                keyExtractor={post => post._id}
                renderItem={ ({item}) => (

                    <View style= {styles.feedIten}>
                        <View style={styles.feedItemHeader}>
                            <View style={styles.userInfo}>
                                 <View style={styles.name}><Text>{item.author}</Text></View>
                                <View style={styles.place}><Text>{item.place}</Text></View>
                            </View>
                            <Image source = {more} />
                        </View>
                        <Image source = {styles.feedImage} source={{uri:`http://10.0.3.2:3333/files/${item.image}`}} />
               
                        <View style={styles.feedItemFooter}>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => {}}>
                                    <Image source= {like}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {}}>
                                    <Image source= {comment}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {}}>
                                    <Image source= {send}/>
                                </TouchableOpacity>
                             

                            </View>
                            <Text style={styles.likes}>{item.likes} curtidas </Text>
                            <Text style={styles.descriptions}>{item.descriptions}</Text>
                            <Text style={styles.hashtags}>{item.hashtags}</Text>
                        </View>
                    </View>
                 
                    )}
            />
        </View>  
     )
  }
 }

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    feedItem:{
        marginTop:20
    },
    feedItemHeader:{
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center' ,
        justifyContent:'space-between',

    },
    name:{
        fontSize:14,
        color:'#000',

    },
    place:{
        fontSize:12,
        color:'#666',
        marginTop:2,
    },
    feedImage:{
        width:'100%',
        height:400,
        marginVertical:15,

    },
    feedItemFooter:{
        paddingHorizontal:15,

    },
    actions:{
        flexDirection:'row',

    },
    action:{
        marginRight:8,

    },
    likes:{
        marginTop:15,
        fontWeight:'bold',
        color:'#000',
    },
    descriptions:{
        lineHeight:18,
        color:'#000',
    },
    hashtags:{
        color:'#7159c1'
    }

  
})