import { useState } from "react";

export default function App() {
  const [allArgeed, setAllAgreed] = useState(false);
  const [agreements, setAgreements] = useState({
    termsAgreed: false,
    personallnfoAgreed: false,
    provisionAgreed: false,
    locationAgreed: false,
    eventAlarmAgreed: false,
    serviceAlarmAgreed: false,
  });

  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;

    setAgreements((prevAgreements) => ({ ...prevAgreements, [name]: checked }));
    const allChecked = Object.values({ ...agreements, [name]: checked }).every(
      (value) => value === true,
    );
    setAllAgreed(allChecked);
  };

  const handleAllArgeementChange = (e) => {
    const { checked } = e.target;
    setAgreements((prevAgreements) =>
      Object.keys(prevAgreements).reduce(
        (newAgreements, agreementKey) => ({
          ...newAgreements,
          [agreementKey]: checked,
        }),
        {},
      )
    );
    setAllAgreed(checked);
  };

  return (
    <div>
      <label>회원 정보 입력 및 이용약관 동의</label>
      <ul>
        <li>
          <input
            type="checkbox"
            id="agree_check_all"
            name="agree_check_all"
            checked={allArgeed}
            onChange={handleAllArgeementChange}
          />
          <label htmlFor="agree_check_all">이용약관 전체동의</label>
        </li>
        <li>
          <input
            type="checkbox"
            id="agree_check_used"
            name="termsAgreed"
            required
            checked={agreements.termsAgreed}
            onChange={handleAgreementChange}
          />
          <label htmlFor="agree_check_used">[필수] 이용약관 동의</label>
        </li>
        <li>
          <input
            type="checkbox"
            id="agree_check_info"
            name="personallnfoAgreed"
            required
            checked={agreements.personallnfoAgreed}
            onChange={handleAgreementChange}
          />
          <label htmlFor="agree_check_info">
            [필수] 개인정보 이용 수집 방침
          </label>
        </li>
        <li>
          <input
            type="checkbox"
            id="agree_check_info_other"
            name="provisionAgreed"
            required
            checked={agreements.provisionAgreed}
            onChange={handleAgreementChange}
          />
          <label htmlFor="agree_check_info_other">
            [필수] 개인정보 제 3자 제공 동의
          </label>
        </li>
        <li>
          <input
            type="checkbox"
            id="agree_check_event_receive"
            name="eventAlarmAgreed"
            checked={agreements.eventAlarmAgreed}
            onChange={handleAgreementChange}
          />
          <label htmlFor="agree_check_event_receive">
            [선택] 이벤트 및 혜택 알림 수신 동의
          </label>
        </li>
        <li>
          <input
            type="checkbox"
            id="agree_check_push"
            name="serviceAlarmAgreed"
            checked={agreements.serviceAlarmAgreed}
            onChange={handleAgreementChange}
          />
          <label htmlFor="agree_check_push">
            [선택] 서비스 알림 수신 동의
          </label>
        </li>
      </ul>
    </div>
  );
}
