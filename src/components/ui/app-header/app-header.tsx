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
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <BurgerIcon type="primary" />
            <p>Конструктор</p>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type="primary" />
            <p>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/">
            <Logo className="" />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to={userName ? '/profile' : '/login'}
            className={({ isActive }) =>
              `${styles.link} ${styles.link_position_last} ${isActive ? styles.link_active : ''}`
            }
          >
            <ProfileIcon type="primary" />
            <p>{userName ?? 'Личный кабинет'}</p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
