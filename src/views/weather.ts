export interface WeatherForecast {
    success: string;
    result: {
        resource_id: string;
        fields: Array<{
            id: string;
            type: string;
        }>;
    };
    records: {
        datasetDescription: string;
        location: Array<{
            locationName: string;
            weatherElement: Array<{
                elementName: string;
                time: Array<{
                    startTime: string;
                    endTime: string;
                    parameter: {
                        parameterName: string;
                        parameterValue?: string;
                        parameterUnit?: string;
                    };
                }>;
            }>;
        }>;
    };
}

// The response format for the chatbot
export interface BotResponse {
    message: string;
    data?: any;
}

// Example function to fetch weather data and prepare a chatbot-friendly response
export async function fetchWeatherData(): Promise<BotResponse> {
    const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-EC987A54-DB8B-4E1A-AD8E-C775D2258D57&locationName=%E8%87%BA%E5%8C%97%E5%B8%82&elementName='; // Replace with actual API endpoint

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data: WeatherForecast = await response.json();

        // Process the weather data
        const weatherDetails = data.records.location.map((location) => {
            const locationName = location.locationName;
            const weatherElement = location.weatherElement.find(
                (element) => element.elementName === 'Wx'
            );
            const forecastTimes = weatherElement?.time.map((time) => {
                const startTime = time.startTime;
                const endTime = time.endTime;
                const weatherCondition = time.parameter.parameterName;

                return `From ${startTime} to ${endTime}, the weather in ${locationName} is expected to be ${weatherCondition}.`;
            });

            return forecastTimes?.join('\n') || `No weather data available for ${locationName}.`;
        });

        const responseMessage = weatherDetails.join('\n');

        // Return structured data for the chatbot
        return {
            message: responseMessage,
            data: data // Optionally include raw data for further processing
        };
    } catch (error) {
        console.error('Failed to fetch or process weather data:', error);
        return {
            message: 'Sorry, I could not fetch the weather data. Please try again later.'
        };
    }
}

