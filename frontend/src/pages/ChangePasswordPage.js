import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react'
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useToast();
    const { changePassword } = useContext(AuthContext);
    const checkAndChangePassword = (e, oldPassword, newPassword, confirmPassword) => {
        e.preventDefault();
        if (newPassword != confirmPassword) {
            toast({
                title: 'Passwords didnt match',
                description: 'Password and Confirm Password must be same',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return;
        } else {
            changePassword(e, oldPassword, newPassword);
        }
    }


    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={useColorModeValue('white', 'gray.700')}
                rounded={'xl'}
                boxShadow={'lg'}
                p={6}
                my={12}>
                <Button
                    colorScheme="blue"
                    variant="solid"
                    w={"100px"}
                    size="md"
                    _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                    }}
                    onClick={() => navigate('/')}
                    transition="all 0.2s">
                    <ArrowBackIcon />
                    Go Back
                </Button>
                <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                    Enter new password
                </Heading>
                <FormControl id="old-password" isRequired>
                    <FormLabel >Old Password</FormLabel>
                    <Input type="password" placeholder='**************' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </FormControl>
                <FormControl id="new-password" isRequired>
                    <FormLabel>New Password</FormLabel>
                    <Input type="password" placeholder='**************' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </FormControl>
                <FormControl id="confirm-password" isRequired>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input type="password" placeholder='**************' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </FormControl>
                <Stack spacing={6}>
                    <Button
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                            bg: 'blue.500',
                        }}
                        onClick={(e) => checkAndChangePassword(e, oldPassword, newPassword, confirmPassword)}
                    >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    )
}