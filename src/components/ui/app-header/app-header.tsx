import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.link} text text_type_main-default ml-2 mr-10 ${
                isActive ? 'text_color_primary' : 'text_color_inactive'
              }`
            }
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <BurgerIcon type="primary" />
            <p>Конструктор</p>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} text text_type_main-default ml-2 ${
                isActive ? 'text_color_primary' : 'text_color_inactive'
              }`
            }
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <ListIcon type="primary" />
            <p>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <Logo className="" />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to={userName ? '/profile' : '/login'}
            className={({ isActive }) =>
              `${styles.link} text text_type_main-default ml-2 ${
                isActive ? 'text_color_primary' : 'text_color_inactive'
              }`
            }
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <ProfileIcon type="primary" />
            <p>{userName ?? 'Личный кабинет'}</p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
