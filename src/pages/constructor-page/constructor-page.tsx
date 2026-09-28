import type { FC } from 'react';
import { useSelector } from '../../services/store';
import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components/burger-ingredients';
import { BurgerConstructor } from '../../components/burger-constructor';
import { Preloader } from '../../components/ui/preloader';

export const ConstructorPage: FC = () => {
  const { loading } = useSelector((state) => state.ingredients);

  return (
    <>
      {loading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`text text_type_main-large mt-10 mb-5 ${styles.title}`}
          >
            Собрать бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};