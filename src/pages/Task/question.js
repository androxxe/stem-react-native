import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, ScrollView, Dimensions, StyleSheet, Modal, Pressable, Alert, TouchableOpacity } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { Button, Card, colors, Header, Icon, Avatar, Input, Text, CheckBox, Badge, Image } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import { LeftBackPage } from '../../components/atoms'
import { variable } from '../../utils'
import { Formik } from 'formik'
import * as yup from 'yup'
import { axiosPost } from '../../functions'
import { useDispatch, useSelector } from 'react-redux'
import { useToastErrorDispatch } from '../../hooks'
import { setLoadingGlobal } from '../../redux'
import ImageZoom from 'react-native-image-pan-zoom';

const Answer = ({setLoadingGlobal, trailTask, dispatch, user, navigation, errorDispatch, totalSoalFillTheBlank}) => {
    if(trailTask.task.tipe_jawaban == 1){
        return <View>
            <Formik
                initialValues={{ exact_value_answer: trailTask.task.task_answer.length > 0 ? trailTask.task.task_answer[0].exact_value_answer : '' }}
                onSubmit={async (values) => await handleSubmitForm({setLoadingGlobal, values, trailTask, dispatch, user, navigation, errorDispatch})}
                validationSchema={yup.object().shape({
                    exact_value_answer: yup.string().required('Jawaban tidak boleh kosong'),
                })}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                    <>
                        <Input
                            placeholder="Isi jawaban disini..."
                            label="Jawaban Eksak"
                            style={styles.textInput}
                            disabled={trailTask.task.task_answer.length > 0 ? true : false}
                            onChangeText={handleChange('exact_value_answer')}
                            value={values.exact_value_answer}
                            onBlur={handleBlur('exact_value_answer')}
                            errorMessage={errors.exact_value_answer && touched.exact_value_answer ? errors.exact_value_answer : ''}
                        />
                        <Button title={trailTask.task.task_answer.length > 0 ? "Kamu sudah menjawab" : "Simpan"} disabled={trailTask.task.task_answer.length > 0 ? true : false} buttonStyle={{ backgroundColor: colors.success, marginTop: 10 }} onPress={handleSubmit} />
                    </>
                )}
            </Formik>
        </View>
    } else if (trailTask.task.tipe_jawaban == 2) {
        let initialValues = trailTask.task.task_multiple_choice.map(val => {
            let is_checked = false
            if(trailTask.task.task_answer.length > 0){
                trailTask.task.task_answer[0].task_multiple_choice_answer.map(val2 => {
                    if(val2.id_task_multiple_choice == val.id_task_multiple_choice){
                        is_checked = true
                    }
                })
            }
            return { is_checked: is_checked, id_task_multiple_choice: val.id_task_multiple_choice }
        })
        return <View>
            <Formik
                initialValues={initialValues}
                onSubmit={async (values) => await handleSubmitForm({setLoadingGlobal, values, trailTask, dispatch, user, navigation, errorDispatch})}
                validationSchema={yup.object().shape({
                    is_checked: yup.array().required('Jawaban tidak boleh kosong'),
                })}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
                        { trailTask.task.task_multiple_choice.map((val, index) => 
                            <View key={`${index}`}>
                                <CheckBox
                                    center
                                    title={ val.nilai }
                                    iconType='font-awesome'
                                    checkedIcon='check'
                                    disabled={trailTask.task.task_answer.length > 0 ? true : false}
                                    checked={values[index].is_checked}
                                    containerStyle={{ 
                                        alignItems: 'flex-start'
                                    }}
                                    onPress={() => setFieldValue(`[${[index]}]is_checked`, !values[index].is_checked)}
                                />
                            </View>
                        )}
                        <Button title={trailTask.task.task_answer.length > 0 ? "Kamu sudah menjawab" : "Simpan"} disabled={trailTask.task.task_answer.length > 0 ? true : false} buttonStyle={{ backgroundColor: colors.success, marginTop: 10 }} onPress={handleSubmit} />
                    </>
                )}
            </Formik>
        </View>
    } else if (trailTask.task.tipe_jawaban == 3){
        let arrayTemp = []
        
        if(trailTask.task.task_answer.length > 0){
            trailTask.task.task_answer[0].task_fill_the_blank_answer.map((val, index) => {
                arrayTemp[index] = ({
                    answer: val.answer
                })
            })
        } else {
            for (let index = 0; index < totalSoalFillTheBlank; index++) {
                arrayTemp[index] = ({
                    answer: ''
                })
            }
        }
        
        return <View>
            <Formik
                initialValues={arrayTemp}
                enableReinitialize={true}
                onSubmit={async (values) => await handleSubmitForm({setLoadingGlobal, values, trailTask, dispatch, user, navigation, errorDispatch})}
                validationSchema={yup.array()
                    .of(
                        yup.object().shape({
                            answer: yup.string().required('Jawaban harus di isi'),
                        })
                    )}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue}) => 
                    values.length > 0 ?
                        <>
                            { arrayTemp.map((val, index) => 
                                <Input
                                    key={`${index}`}
                                    placeholder="Isi jawaban disini..."
                                    label="Jawaban"
                                    style={styles.textInput}
                                    disabled={trailTask.task.task_answer.length > 0 ? true : false}
                                    onChangeText={(text) => setFieldValue(`[${[index]}]answer`, text)}
                                    value={values[index].answer}
                                    // onBlur={handleBlur(`[${[index]}]answer`)}
                                    errorMessage={errors[index]?.answer && touched[index]?.answer ? errors[index].answer : ''}
                                />
                            )}
                            <Button title={trailTask.task.task_answer.length > 0 ? "Kamu sudah menjawab" : "Simpan"} disabled={trailTask.task.task_answer.length > 0 ? true : false} buttonStyle={{ backgroundColor: colors.success, marginTop: 10 }} onPress={handleSubmit} />
                        </>
                    : null 
                }   
            </Formik>
        </View>
    } else if (trailTask.task.tipe_jawaban == 4){
        return <View>
            <Formik
                initialValues={{ essay_answer: trailTask.task.task_answer.length > 0 ? trailTask.task.task_answer[0].essay_answer : '' }}
                onSubmit={async (values) => await handleSubmitForm({setLoadingGlobal, values, trailTask, dispatch, user, navigation, errorDispatch})}
                validationSchema={yup.object().shape({
                    essay_answer: yup.string().required('Jawaban tidak boleh kosong'),
                })}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
                    <>
                        <Input
                            placeholder="Isi jawaban disini..."
                            label="Jawaban"
                            style={styles.textInput}
                            disabled={trailTask.task.task_answer.length > 0 ? true : false}
                            onChangeText={handleChange('essay_answer')}
                            value={values.essay_answer}
                            onBlur={handleBlur('essay_answer')}
                            multiline={true}
                            style={{ 
                                height: 120,
                                borderWidth: 1,
                                borderColor: colors.grey5,
                                padding: 10,
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                marginTop: 10
                            }}
                            containerStyle={{ 
                            }}
                            errorMessage={errors.essay_answer && touched.essay_answer ? errors.essay_answer : ''}
                        />
                        <Button title={trailTask.task.task_answer.length > 0 ? "Kamu sudah menjawab" : "Simpan"} disabled={trailTask.task.task_answer.length > 0 ? true : false} buttonStyle={{ backgroundColor: colors.success, marginTop: 10 }} onPress={handleSubmit} />
                    </>
                )}
            </Formik>
        </View>
    }

    return null
}

const handleSubmitForm = async ({ setLoadingGlobal, dispatch, trailTask, values, user, navigation, errorDispatch }) => {
    let answer
    // alert('ya')
    // return
    dispatch(setLoadingGlobal(true))
    if(trailTask.task.tipe_jawaban == 1){
        answer = {
            exact_value_answer: values.exact_value_answer
        }
    } else if(trailTask.task.tipe_jawaban == 2) {
        let isSudahIsi = false
        values.map(val => {
            if(val.is_checked == true){
                isSudahIsi = true
            }
        })
        if(!isSudahIsi){
            errorDispatch(dispatch, 'Minimal memilih 1 opsi')  
            dispatch(setLoadingGlobal(false))
            return
        }

        answer = {
            id_task_multiple_choice: values
        }
    } else if(trailTask.task.tipe_jawaban == 3){
        answer = {
            answer: values
        }
    } else if(trailTask.task.tipe_jawaban == 4){
        answer = {
            essay_answer: values.essay_answer
        }
    }

    const response = await axiosPost({dispatch, route: 'task/jawab', 
        headers: {
            token: user.token
        },
        data:{
            id_trail_task: trailTask.id_trail_task,
            ...answer
        }
    })

    setTimeout(() => {
        dispatch(setLoadingGlobal(false))
        navigation.goBack();
    }, 1000)
}

const Question = ({ navigation, route }) => {
    const [trailTask, setTrailTask] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isShowModalHint, setIsShowModalHint] = useState(false)
    const [dataHint, setDataHint] = useState({})
    const [dataHintOpen, setDataHintOpen] = useState([])
    const [totalSoalFillTheBlank, setTotalSoalFillTheBlank] = useState(0)

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const errorDispatch = useToastErrorDispatch()
    const { location, statusPermission, isGpsOn, isDenied, isLoadingLocation, isModalEnableGPS } = useSelector(state => state.location)

    useEffect(() => {
        setIsLoading(true)
        setTrailTask(route.params.trail_task)
        setIsLoading(false)
        loopCurrentLocation()
    }, [])

    useEffect(() => {
        if(trailTask?.task?.fill_the_blank_question){
            setTotalSoalFillTheBlank(trailTask.task.fill_the_blank_question.split("***").length - 1)
        }
    }, [trailTask])

    const loopCurrentLocation = () => {
        if(navigation.isFocused()){
            saveCurrentLocation()
            
            setTimeout(function() {   
                loopCurrentLocation()
            }, 10000)
        }
    }

    const saveCurrentLocation = async () => {
        const response = await axiosPost({dispatch, route: 'trail/current-location/simpan',
            headers: {
                token: user.token
            },
            data: {
                id_trail_user: route.params.id_trail_user,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }, 
            isToast: false
        })

        if(response.status == 0){
            errorDispatch(dispatch, response.message ? response.message : 'Gagal menyimpan data lokasi')
        }
    }

    const Question = () => {
        if(trailTask.task.tipe_jawaban == 1){
            return <Text style={styles.question}>{ trailTask.task.exact_value_question }</Text>
        } else if(trailTask.task.tipe_jawaban == 2) {
            return <Text style={styles.question}>{ trailTask.task.multiple_choice_question }</Text>
        } else if(trailTask.task.tipe_jawaban == 3) {
            return <Text style={{ ...styles.question, fontSize: 16 }}>
                { trailTask.task.fill_the_blank_question.split("***").join("______________") }
            </Text>
        } else if(trailTask.task.tipe_jawaban == 4){
            return <Text style={styles.question}>{ trailTask.task.essay_question }</Text>
        }
        return null
    }

    const handleModalHint = ({val, isTampil, index}) => {
        if(isTampil){
            setIsShowModalHint(true)
            setDataHint(val)
            setDataHintOpen([...dataHintOpen, index])
            setDataHintOpen([...dataHintOpen, index + 1])
        }
    }

    const handleCloseModal = () => {
        setIsShowModalHint(false)
        setDataHint({})
    }

    const Hint = ({val, index}) => {
        let isTampil = false
        
        if(index == 0){
            isTampil = true
        }
        dataHintOpen.map(val2 => {
            if(val2 == index){
                isTampil = true
            }
        })

        return <Icon
            key={`${index}`}
            raised
            name='lightbulb-on'
            type='material-community'
            color={isTampil ? colors.primary : colors.grey3}
            reverse
            containerStyle={{ 
                marginHorizontal: 4
            }}
            size={16}
            onPress={() => handleModalHint({val, isTampil, index})} />
    }

    const KunciJawaban = () => {
        if(trailTask.task.tipe_jawaban == 1){
            return <Text style={styles.question}>
                { trailTask.task.exact_value_answer }
            </Text>
        } else if (trailTask.task.tipe_jawaban == 2){
            return trailTask.task.task_multiple_choice.map((val, index) => {
                return <View key={`list_${index}`}>
                    <CheckBox
                        center
                        title={ val.nilai }
                        iconType='font-awesome'
                        checkedIcon='check'
                        iconStyle={{
                            color: 'red'
                        }}
                        checkedColor={colors.grey2}
                        disabled={trailTask.task.task_answer.length > 0 ? true : false}
                        checked={val.is_true == 1 ? true : false}
                        containerStyle={{ 
                            alignItems: 'flex-start'
                        }}
                    />
                </View>
            })
        } else if (trailTask.task.tipe_jawaban == 3){
            return <Text style={styles.question}>
                -
            </Text>
        } else if (trailTask.task.tipe_jawaban == 4){
            return <Text style={styles.question}>
                -
            </Text>
        }

        return null
    }

    const ModalHint = () => {
        return <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isShowModalHint}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setIsShowModalHint(!isShowModalHint);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ 
                            marginTop: -100,
                            backgroundColor: 'white',
                            borderRadius: 100,
                            padding: 10
                        }}>
                            <Icon
                                raised
                                name='lightbulb-on'
                                type='material-community'
                                color={colors.primary}
                                containerStyle={{ 
                                    marginHorizontal: 4,
                                    borderWidth: 2,
                                    borderColor: colors.primary,
                                    borderStyle: 'dashed',
                                }}
                                size={70}
                            />
                        </View>
                        <Text style={{ fontSize: RFValue(16, height), marginBottom: 10 }}>{ dataHint.text_hint }</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleCloseModal}>
                            <Text style={styles.textStyle}>Tutup</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    }

    if(isLoading){
        return <View>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    } else {
        return (
            <View style={{ 
                flex: 1,
            }}>
                <Header 
                    leftComponent={() => LeftBackPage(navigation)}
                    centerComponent={{
                        text: trailTask.task.judul,
                        style: {
                            fontFamily: 'Poppins-Bold',
                            fontSize: RFValue(16, height),
                            color: colors.white,
                        }
                    }}
                />
                <ScrollView>
                    <TouchableOpacity onPress={() => navigation.navigate('ImagePanZoom', {
                        image: `${variable.storage}${trailTask.task.foto}`
                    })}>
                        <AutoHeightImage
                            width={width}
                            source={{ uri: `${variable.storage}${trailTask.task.foto}` }}
                            style={{ 
                                backgroundColor: 'white'
                            }}
                        />
                    </TouchableOpacity>
                    <Card containerStyle={{ 
                        borderRadius: 20,
                        marginTop: -30
                    }}>
                        <View style={{
                            borderRadius: 20,
                            padding: 6,
                            position: 'absolute',
                            marginTop: -36,
                            backgroundColor: colors.primary,
                            paddingHorizontal: 14,
                            right: 0
                        }}>
                            <Text style={{ 
                                color: 'white',
                                fontWeight: 'bold'
                            }}>{`${trailTask.task.score} Skor`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', marginBottom: 16 }}>
                            <View style={{ flexDirection: 'row' }}>
                                { trailTask.task.task_hint.map((val, index) => 
                                    <Hint val={val} key={`${index}`} index={index} />
                                )}
                            </View>
                            <Icon
                                raised
                                name='forward'
                                type='font-awesome'
                                color={colors.warning}
                                reverse
                                containerStyle={{ 
                                    marginHorizontal: 4
                                }}
                                size={16} 
                                onPress={() => {
                                    if(trailTask.task.task_answer.length > 0){
                                        navigation.goBack()
                                    } else {
                                        Alert.alert(
                                            "Keluar dari tugas",
                                            "Apakah kamu yakin keluar dari tugas? kamu bisa lanjutkan lagi nanti",
                                            [
                                              {
                                                text: "Batal",
                                                style: "cancel"
                                              },
                                              { text: "Yakin", onPress: () => navigation.goBack()}
                                            ]
                                        )
                                    }
                                }}
                            />
                        </View>
                        <Text style={styles.questionTitle}>Soal</Text>
                        <Question />
                        <View style={{ height: 12 }} />
                        <Text></Text>
                        <Answer setLoadingGlobal={setLoadingGlobal} totalSoalFillTheBlank={totalSoalFillTheBlank} errorDispatch={errorDispatch} navigation={navigation} user={user} dispatch={dispatch} trailTask={trailTask} />
                    </Card>
                    { trailTask.task.task_answer.length > 0 ?
                        <Card containerStyle={{ borderRadius: 20 }}>
                            <Text style={styles.questionTitle}>Kunci Jawaban</Text>
                            <KunciJawaban />
                            <View style={{ marginTop: 20 }} />
                            <Text style={styles.questionTitle}>Skor Kamu</Text>
                            <Text style={styles.question}>
                                { trailTask.task.task_answer[0].score != null ? 
                                    trailTask.task.task_answer[0].score == 0 ?
                                        <Text style={{ color: colors.error, fontWeight: 'bold' }}>{ trailTask.task.task_answer[0].score }</Text>
                                    : trailTask.task.task_answer[0].score == trailTask.task.score ?
                                    <Text style={{ color: colors.success, fontWeight: 'bold' }}>{ trailTask.task.task_answer[0].score }</Text> : trailTask.task.task_answer[0].score
                                : 'Belum diperiksa' }
                            </Text>
                        </Card>
                    : null }
                    <Card containerStyle={{ borderRadius: 20, marginBottom: 20 }}>
                        <Text style={styles.questionTitle}>Author</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                            <Avatar
                                size="medium"
                                rounded
                                source={{
                                    uri: `${variable.storage}${trailTask.task.user.foto}`,
                                }}
                            />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={styles.question}>{ trailTask.task.user.nama }</Text>
                                <Text style={{ ...styles.question, color: colors.grey3, fontSize: 16 }}>{ trailTask.task.user.email }</Text>
                            </View>
                        </View>
                    </Card>
                </ScrollView>
                <ModalHint />
            </View>
        )
    }

}

const { width, height } = Dimensions.get("window")

export default Question

const styles = StyleSheet.create({
    question: {
        fontSize: 18,
        // fontSize: RFValue(19, height),
        marginHorizontal: 10
    },
    questionTitle: {
        fontSize: 16,
        // fontSize: RFValue(17, height),
        marginHorizontal: 10,
        fontWeight: 'bold',
        color: colors.grey3,
        marginBottom: 6
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000052',
    },
    modalView: {
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: width - 60,
        backgroundColor: 'white',
        paddingHorizontal: 24,
        textAlign: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 20,
        padding: 6,
        elevation: 2,
        width: 100,
    },
    buttonClose: {
        backgroundColor: colors.primary,
        marginVertical: 10
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
})
