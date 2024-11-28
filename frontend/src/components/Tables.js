import React, { useContext, useEffect, useState } from 'react'
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Text,
    Flex,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    useColorModeValue,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Tables = () => {
    const toast = useToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [query, setQuery] = useState("");
    let navigate = useNavigate();
    let { user } = useContext(AuthContext);
    let searchTask = async () => {
        onClose();
    }


    return (
        <Box m={2}>
            <Flex h={16} alignItems={'center'} justifyContent={'space-between'} m={4}>
                <Box
                    as="a"
                    px={2}
                    py={1}
                    rounded={'md'}
                    _hover={{
                        textDecoration: 'none',
                        bg: useColorModeValue('gray.200', 'gray.700'),
                        cursor: "pointer"
                    }}
                >
                    <Button onClick={onOpen} size={{ base: "sm", lg: "md" }}><SearchIcon m={1} /></Button>
                    <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerHeader borderBottomWidth='1px'></DrawerHeader>
                            <DrawerBody>
                                <InputGroup>
                                    <InputLeftElement pointerEvents='none'>
                                        <SearchIcon color='gray.500' />
                                    </InputLeftElement>
                                    <Input type='search' color='gray.500' placeholder='Search for something' name={query} value={query} />
                                    <InputRightElement width='4.5rem'>
                                        <Button>
                                            Submit
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </Box>
            </Flex>
            <Heading m={3}>Hi {user && user.firstname.split(" ")[0].toUpperCase()} Welcome to Profile &amp; Authentication using Django</Heading>
            <Text m={4}>Ex non culpa do duis id nulla sit sit tempor laborum. Culpa enim nisi nisi veniam in do. Reprehenderit officia cupidatat qui ullamco ullamco. Eu veniam enim sit veniam id sit. Enim dolor est elit anim ea laborum esse id quis. Ex exercitation nisi non incididunt incididunt ad id enim proident ullamco.

                Aute excepteur sunt nostrud aute sint nisi adipisicing reprehenderit cupidatat excepteur deserunt nisi officia aute. Minim culpa eiusmod magna in consectetur ipsum. Officia sint magna fugiat non mollit Lorem. Irure pariatur cupidatat ut anim labore occaecat ullamco nisi enim ea ex nulla elit.

                Velit Lorem exercitation et occaecat esse do aliquip nostrud quis. Ullamco mollit incididunt anim adipisicing sint voluptate et. Reprehenderit enim elit reprehenderit amet aliquip cupidatat pariatur id do ut laborum. Ut incididunt est laborum nulla dolor ad. Sit ad non exercitation nulla aute incididunt sunt id sit.

                Velit commodo anim sunt aliquip amet. Sunt aliqua ex reprehenderit deserunt pariatur incididunt ex eiusmod commodo quis veniam. Cillum aute Lorem ut magna officia sunt magna duis aliquip pariatur ipsum proident velit Lorem. Occaecat quis nisi id fugiat reprehenderit mollit ea laborum excepteur.

                Veniam ipsum ea velit nulla anim. Non velit in tempor enim reprehenderit commodo quis ut aute nisi nostrud. Aliqua aliquip culpa incididunt reprehenderit exercitation aute eiusmod commodo eu occaecat laboris consequat. Occaecat quis eu veniam qui elit reprehenderit laborum eu.

                Proident nisi proident amet anim cillum nostrud. Officia ut deserunt cupidatat duis elit tempor eiusmod pariatur nostrud reprehenderit mollit culpa tempor in. Magna ea deserunt mollit ullamco ad laboris sit.</Text>
        </Box>
    )
}

export default Tables;