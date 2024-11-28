import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    useToast,
    VStack,
} from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
// import AuthContext from '../context/AuthContext';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const { token } = useParams()
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useToast();
    const { validateToken, isTokenValid, tokenError } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            validateToken(token)
                .finally(() => setIsLoading(false));
        }
    }, [token]);

    const checkAndChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast({
                title: 'Passwords did not match',
                description: 'Password and Confirm Password must be the same',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
            return;
        }

        try {
            const response = await fetch('/api/reset-password-confirm/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: newPassword,
                    token: token,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                toast({
                    title: 'Password Reset Successful!',
                    description: 'Your password has been reset successfully. Please login with your new password.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
                navigate('/login');
            } else {
                toast({
                    title: 'Error',
                    description: data.detail,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error occurred while resetting your password.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };

    if (!isTokenValid && tokenError) {
        return (
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={'gray.800'}>
                <VStack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={'gray.700'}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                    my={12}>
                    <Heading color="red.500">Token Invalid</Heading>
                    <Text textAlign="center">{tokenError}</Text>
                    <Button
                        colorScheme="blue"
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </Button>
                </VStack>
            </Flex>
        );
    }

    if (isLoading) {
        return (
            <Flex minH={'100vh'} align={'center'} justify={'center'} bg={'gray.800'}>
                <VStack spacing={4}>
                    <Heading color="white">Validating Reset Token...</Heading>
                </VStack>
            </Flex>
        );
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={'gray.800'}>
            <Stack
                spacing={4}
                w={'full'}
                maxW={'md'}
                bg={'gray.700'}
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
                        onClick={(e) => checkAndChangePassword(e, newPassword, confirmPassword)}
                    >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    )
}