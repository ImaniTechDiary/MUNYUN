import React, { useState } from 'react'
import { Box, Image, Heading, Text, HStack, IconButton, useColorModeValue, useToast, ModalOverlay, ModalCloseButton, Input,
  Modal,  ModalContent, ModalHeader, ModalBody, VStack, ModalFooter, Button, useDisclosure
 } from '@chakra-ui/react'

import {  FaEdit as EditIcon } from 'react-icons/fa'; // imrport edit icon
import { MdDelete as DeleteIcon } from 'react-icons/md'; //Import DeleteIcon 
import { useEventTracking } from '../tracking/event';

const EventCard = ({event}) => {
  const textColor = useColorModeValue('gray.600', 'gray.200')
  const bg = useColorModeValue('white', 'gray.800')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [updatedEvent, setUpdatedEvent] = useState(event)
  const {deleteEvent, updateEvent } = useEventTracking()
  const toast = useToast()
 

  const handleDeleteEvent = async (eid) => {
    const {success, message} = await deleteEvent(eid)
    if (!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        isClosable: true,
        duration: 3000
      })
    } else {
      toast({
      title: 'Success',
      description: message,
      status: 'success',
      isClosable: true,
      duration: 3000
    })
  }}

  const handleUpdateEvent = async (eid, updatedEvent) => {
    await updateEvent(eid, updatedEvent)
    onClose()
    if (!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        isClosable: true,
        duration: 3000       
      })
    } else {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        isClosable: true,
        duration: 3000       
      })
    }
  }

  const handleOpenModal = () => {
    setUpdatedEvent(event)
    onOpen()
  } 


  // const handleModalClose = () => {
  //   onClose() //Ensure the modal close state is triggered
  //   setTimeout(() => {
  //     document.activeElement.blur() //Reset focus
  //   }, 0)
  // }

  return (
    <Box
        shadow='lg'
        rounded='lg'
        overflow='hidden'
        transition='all 0.3s'
        _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
        bg={bg}
    >
        {/* <Image  src={event.image} alt={event.name} h={48} w='full' objectFit='cover'/> */}

        <Box p={4}>
        <Heading as='h3' size='md' mb={2}>
          {event.title}
        </Heading> 

        <Text fontWeight='bold' fontSize='xl' color={textColor} mb={4}>
          ${event.start}
        </Text>

          <HStack spacing={2}>
            <IconButton aria-hidden="false" icon={<EditIcon />} colorScheme='blue' 
            onClick={onOpen} //handle fxn that opens and closes specified modal
            /> 
            <IconButton icon={<DeleteIcon />} colorScheme='red' 
            onClick={() => handleDeleteEvent(event._id)} />
          </HStack>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>


          <ModalContent>
            <ModalHeader>Update event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input placeholder='event Title' name='title' value={updatedEvent.title}
                  onChange={(e) => setUpdatedEvent({ ...updatedEvent, name: e.target.value})}
                />
                <Input placeholder='event Start Date' name='start' type='date' value={updatedEvent.start}
                  onChange={(e) => setUpdatedEvent({ ...updatedEvent, start: e.target.value})}
                />
                <Input placeholder='Event URL' name='end' type='date' value={updatedEvent.end}
                  onChange={(e) => setUpdatedEvent({ ...updatedEvent, end: e.target.value})}
                />
                <Input placeholder='event Category' name='category' value={upupdatedEventdatedEvent.category}
                  onChange={(e) => setUpdatedEvent({ ...updatedEvent, category: e.target.value})}
                />
              </VStack>setUpdatedEvent
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} 
              onClick={() => handleUpdateEvent(event._id, updatedEvent)}>
                Update
              </Button>
              <Button variant='ghost' onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </Box>
  )
}

export default EventCard
