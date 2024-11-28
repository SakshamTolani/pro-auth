import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    Stack,
    Textarea,
    Tooltip,
    useClipboard,
    useColorModeValue,
    VStack,
    Container,
    useToast,
    Icon,
} from '@chakra-ui/react'
import { BsGithub, BsLinkedin, BsPerson, BsTwitter } from 'react-icons/bs'
import { MdEmail, MdOutlineEmail } from 'react-icons/md'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowBackIcon } from '@chakra-ui/icons'

const MotionBox = motion(Box)

const ProfilePage = () => {
    const toast = useToast()
    const navigate = useNavigate();
    const handleSocialClick = (platform) => {
        toast({
            title: `${platform} link copied`,
            status: 'info',
            duration: 2000,
            position: 'top',
        })
    }
    let {profileData} = useContext(AuthContext);
    const { hasCopied, onCopy } = useClipboard(profileData.email)
    return (
        <Flex
            bg={useColorModeValue('gray.50', 'gray.800')}
            minHeight="100vh"
            align="center"
            justify="center"
            bgGradient={useColorModeValue(
                'linear(to-br, blue.50, purple.50)',
                'linear(to-br, gray.900, blue.900)'
            )}
            p={4}>
            <Container maxW="container.xl">
                <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    borderRadius="2xl"
                    boxShadow="2xl"
                    overflow="hidden"
                    bg={useColorModeValue('white', 'gray.700')}>
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        p={{ base: 6, md: 12 }}>
                        {/* Social Media Section */}
                        <VStack
                            bg={useColorModeValue('blue.500', 'blue.600')}
                            color="white"
                            p={8}
                            spacing={6}
                            align="center"
                            justify="center"
                            width={{ base: '100%', md: '40%' }}>
                            <Heading size="lg" textAlign="center">
                                Let's Connect
                            </Heading>
                            <Text textAlign="center" opacity={0.8}>
                                Follow me on social media or copy my contact details
                            </Text>
                            <Stack direction="row" spacing={4}>
                                {[
                                    { icon: BsGithub, label: 'GitHub' },
                                    { icon: BsTwitter, label: 'Twitter' },
                                    { icon: BsLinkedin, label: 'LinkedIn' }
                                ].map(({ icon: Icon, label }) => (
                                    <Tooltip key={label} label={label} hasArrow>
                                        <IconButton
                                            icon={<Icon size="24px" />}
                                            variant="outline"
                                            colorScheme="whiteAlpha"
                                            onClick={() => handleSocialClick(label)}
                                            isRound
                                        />
                                    </Tooltip>
                                ))}
                            </Stack>
                            <Tooltip
                                label={hasCopied ? 'Email Copied!' : 'Copy Email'}
                                closeOnClick={false}
                                hasArrow>
                                <Button
                                    leftIcon={<MdEmail />}
                                    variant="outline"
                                    colorScheme="whiteAlpha"
                                    onClick={onCopy}>
                                    {profileData.email}
                                </Button>
                            </Tooltip>
                        </VStack>

                        {/* Form Section */}
                        <Box
                            flex={1}
                            p={{ base: 6, md: 12 }}
                            bg={useColorModeValue('white', 'gray.700')}>
                            <VStack spacing={6} w="full">
                                <Heading size="xl" textAlign="center">
                                    Hi There,
                                </Heading>
                                <VStack spacing={5} w="full">
                                    <FormControl isRequired>
                                        <FormLabel>Name</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <BsPerson color="gray.300" />
                                            </InputLeftElement>
                                            <Input
                                                type="text"
                                                placeholder="Your Full Name"
                                                value={profileData.name}
                                                borderColor="blue.100"
                                                _hover={{ borderColor: 'blue.300' }}
                                                focusBorderColor="blue.500"
                                            />
                                        </InputGroup>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <MdOutlineEmail color="gray.300" />
                                            </InputLeftElement>
                                            <Input
                                                type="email"
                                                value={profileData.email}
                                                placeholder="your.email@example.com"
                                                borderColor="blue.100"
                                                _hover={{ borderColor: 'blue.300' }}
                                                focusBorderColor="blue.500"
                                            />
                                        </InputGroup>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Username</FormLabel>
                                        <InputGroup>
                                            <InputLeftElement pointerEvents="none">
                                                <MdOutlineEmail color="gray.300" />
                                            </InputLeftElement>
                                            <Input
                                                type="email"
                                                value={profileData.username}
                                                borderColor="blue.100"
                                                _hover={{ borderColor: 'blue.300' }}
                                                focusBorderColor="blue.500"
                                            />
                                        </InputGroup>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Date Joined</FormLabel>
                                        <Input
                                            type="datetime-local"
                                            value={new Date((profileData.date_joined).toString()).toISOString().slice(0, 16)}
                                            borderColor="blue.100"
                                            _hover={{ borderColor: 'blue.300' }}
                                            focusBorderColor="blue.500"
                                        />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Last Updated At</FormLabel>
                                        <Input
                                            type="datetime-local"
                                            value={new Date((profileData.updated_at).toString()).toISOString().slice(0, 16)}
                                            borderColor="blue.100"
                                            _hover={{ borderColor: 'blue.300' }}
                                            focusBorderColor="blue.500"
                                        />
                                    </FormControl>

                                    <Button
                                        colorScheme="blue"
                                        variant="solid"
                                        w="full"
                                        size="lg"
                                        _hover={{
                                            transform: 'translateY(-2px)',
                                            boxShadow: 'lg',
                                        }}
                                        onClick={() => navigate('/')}
                                        transition="all 0.2s">
                                        <ArrowBackIcon />
                                        Back to Dashboard
                                    </Button>
                                </VStack>
                            </VStack>
                        </Box>
                    </Flex>
                </MotionBox>
            </Container>
        </Flex>
    )
}

export default ProfilePage