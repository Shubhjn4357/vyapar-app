import React from 'react'
import { Button, Menu } from 'react-native-paper'
import { useCompany } from '../hooks/useCompany';

const CompanySelector = () => {
    const [visible, setVisible] = React.useState(false);
    const { companyList, selectedCompany, handleCompanySelect } = useCompany()
    const handleMenu = () => setVisible(!visible);
    return (
            <Menu
                style={{ top: 50, right: 20 }}
                visible={visible}
                onDismiss={handleMenu}
                anchor={<Button mode="text" onPress={handleMenu}>{selectedCompany?.name}</Button>}>
                {companyList?.map((company) => (
                    <Menu.Item key={company.id} onPress={() => handleCompanySelect(company)} title={company.name} />
                ))}
            </Menu>

       
    )
}

export default CompanySelector