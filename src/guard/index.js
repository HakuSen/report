import router from '../router';
import RouteGuard from './RouteGuard';
import RootGuard from './root';
import WelcomeGuard from './welcome';
import FramesGuard from './frames';

const GuardConfig = {
  global: [RootGuard, WelcomeGuard, FramesGuard]
  // '/frame': HomeGuard
};

export default {
  install(Vue) {
    Vue.$guard = new RouteGuard(router, GuardConfig);
  }
};
