import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, NavigationActions } from 'react-navigation';
import { StartupActivity } from './activities/StartupActivity.js';
import { MainMenuActivity } from './activities/MainMenuActivity.js';
import { GameActivity } from './activities/GameActivity.js';

const MainNavigator = createStackNavigator({
  Startup: { screen: StartupActivity },
  MainMenu: { screen: MainMenuActivity },
  Game: { screen: GameActivity }
});

const defaultGetStateForAction = MainNavigator.router.getStateForAction;

MainNavigator.router.getStateForAction = (action, state) => {
  if (action.type == NavigationActions.BACK && state.routes[state.index].routeName == "MainMenu") {
    return null;
  }

  return defaultGetStateForAction(action, state);
}

const App = createAppContainer(MainNavigator);

export default App;
