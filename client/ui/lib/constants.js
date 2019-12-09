import HomeIcon from '@material-ui/icons/Home';

export const drawerWidth = 240;

export const routes = [
  {
    name: "Home",
    href: "/",
    Icon: HomeIcon
  }
];

export const authenticatedRoutes = [
  {
    name: "Secret Santas",
    href: "/groups",
    Icon: HomeIcon
  },
  {
    name: "Profile",
    href: "/profile",
    Icon: HomeIcon
  }
]