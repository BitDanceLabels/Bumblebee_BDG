import styled from 'styled-components';

const ProgressBarWrapper = styled.div`
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    width: ${props => (props.isMultiple ? '100%' : '60%')};
    gap: 20px;
`;

const Label = styled.div`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
`;

const ProgressBarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const Step = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    position: relative;

    &:not(:last-child):after {
        content: '';
        position: absolute;
        top: 50%;
        right: -50%;
        width: 100%;
        height: 2px;
        background-color: ${props => (props.active ? '#4caf50' : '#ccc')};
        transform: translateY(-50%);
    }
`;

const StepCircle = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => (props.active ? '#4caf50' : '#ccc')};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    font-size: 18px;
    font-weight: bold;

    &::after {
        content: '${props => (props.active ? "✓" : "")}';
        font-size: 18px;
        font-weight: bold;
        color: white;
    }
`;

const StepLabel = styled.div`
    font-size: 16px;
    font-weight: bold;
    color: ${props => (props.active ? '#4caf50' : '#666')};
`;

// eslint-disable-next-line react/prop-types
const ProgressBar = ({data}) => {
    const steps = ['Sale Process', 'PD Process', 'TL Process', 'QC Process'];
    // eslint-disable-next-line react/prop-types
    const isMultiple = data.length > 1;

    return (
        <>
            {/* eslint-disable-next-line react/prop-types */}
            {data.map((item, index) => (
                <ProgressBarWrapper key={index} isMultiple={isMultiple}>
                    {/* Hiển thị label */}
                    <Label>{index === 0 ? 'Now' : 'New Course'}</Label>

                    <ProgressBarContainer>
                        {steps.map((step, stepIndex) => {
                            const statusField = [
                                item.is_sale_done,
                                item.is_pd_done,
                                item.is_tr_done,
                                item.is_qc_done,
                            ][stepIndex];

                            return (
                                <Step key={stepIndex} active={statusField}>
                                    <StepCircle active={statusField}/>
                                    <StepLabel active={statusField}>{step}</StepLabel>
                                </Step>
                            );
                        })}
                    </ProgressBarContainer>
                </ProgressBarWrapper>
            ))}
        </>
    );
};

export default ProgressBar;