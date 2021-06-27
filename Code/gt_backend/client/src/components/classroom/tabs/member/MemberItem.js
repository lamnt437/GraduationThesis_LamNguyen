import styles from './MemberItem.module.css';
import { Avatar } from '@material-ui/core';

const MemberItem = ({ member }) => {
  return (
    <div className={styles.memberItem}>
      <div className={styles.memberItem__top}>
        <Avatar className={styles.avatar} />
        <h3>{member.name}</h3>
      </div>
      <div className={styles.memberItem__bottom}>
        <p>{member.email}</p>
        <div className={styles.role}>
          {member.role == 2 ? (
            <button className={styles.role_teacher}>Teacher</button>
          ) : (
            <button className={styles.role_student}>Student</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberItem;
