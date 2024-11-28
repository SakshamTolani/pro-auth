import React, { useContext } from 'react'
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react'
import AuthContext from "../context/AuthContext"
import Tables from '../components/Tables'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  let { user, logoutUser, profile, changePassword } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Box
              fontWeight='semibold'
              letterSpacing='wide'
              ml='2'>Hi,{user && user.firstname.split(" ")[0].toUpperCase()} 🙏🏻</Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {/* {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))} */}
            </HStack>
          </HStack>
          {user &&
            <Flex alignItems={'center'}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar src="https://i.pravatar.cc/300" size="md" />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={profile}>Check out Profile</MenuItem>
                  <MenuItem onClick={() => navigate('/change-password')}>Change Password</MenuItem>
                  <MenuItem onClick={logoutUser}>Log Out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          }
        </Flex>

      </Box>

      <Box p={4} overflowX={{ sm: "scroll", xl: "hidden" }}><Tables /></Box>
    </>
  )
}

export default HomePage;