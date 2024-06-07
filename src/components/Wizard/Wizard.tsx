import {Stepper, Step, StepLabel, Button, Typography} from '@mui/material';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import WizardActions from './components/WizardActions';

const Wizard = () => {
    const [activeStep, setActiveStep] = useState(0);
    const {t} = useTranslation();

    const steps = [
        t('wizard.stepOne.title'),
        t('wizard.stepTwo.title'),
        t('wizard.stepThree.title'),
        t('wizard.stepFour.title'),
        t('wizard.stepFive.title'),
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const renderActiveStepBox = (activeStep: number) => {
        switch (activeStep) {
            case 0:
                return <h1>{steps[activeStep]}</h1>;
            case 1:
                return <h1>{steps[activeStep]}</h1>;
            case 2:
                return <h1>{steps[activeStep]}</h1>;
            case 3:
                return <h1>{steps[activeStep]}</h1>;
            case 4:
                return <h1>{steps[activeStep]}</h1>;
            default:
                return null;
        }
    };

    return (
        <>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length ? (
                <>
                    <Typography sx={{mt: 2, mb: 1}}>Inviato per la revisione</Typography>
                    <Button onClick={handleReset}>{t('wizard.common.buttons.reset')}</Button>
                </>
            ) : (
                <>
                    {renderActiveStepBox(activeStep)}
                    <WizardActions
                        activeStep={activeStep}
                        stepsNumber={steps.length}
                        handleBack={handleBack}
                        handleNext={handleNext}
                    />
                </>
            )}
        </>
    );
};

export default Wizard;
