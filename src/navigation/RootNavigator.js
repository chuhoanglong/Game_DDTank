import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import GamePlayScreen from '../GamePlayScreen';
import MenuScreen from '../Screen/MenuScreen';
import RoomScreen from '../Screen/RoomScreen';
export default createAppContainer(
    createSwitchNavigator(
        {
            GamePlayScreen,
            MenuScreen,
            RoomScreen
        },
        {
            initialRouteName: 'MenuScreen'
        }
    )
);
